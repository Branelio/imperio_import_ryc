import os
import json
import re
import time
import sys
import requests

# Forzar UTF-8 en stdout y stderr para Windows
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except AttributeError:
        pass

from telethon import TelegramClient, errors

from telethon.tl.functions.channels import CreateChannelRequest, GetFullChannelRequest
from telethon.tl.types import Channel

# Credenciales de Telegram API
API_ID = 37728518
API_HASH = "ece5502a1575c09b99ccc55f2729f257"
CHANNEL_USERNAME = "imporimperioshort"
CHANNEL_TITLE = "Impor Imperio Short🗡️"

SESSION_NAME = "imperio_session"
JSON_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "productos.json")



def clean_html_for_telegram(raw_html: str) -> str:
    """Limpia etiquetas HTML no soportadas por Telegram conservando formato básico."""
    if not raw_html:
        return ""

    # Reemplazar encabezados y párrafos por saltos de línea y negritas
    text = re.sub(r"<h2>(.*?)</h2>", r"\n<b>\1</b>\n", raw_html, flags=re.IGNORECASE)
    text = re.sub(r"<h3>(.*?)</h3>", r"\n<b>\1</b>\n", text, flags=re.IGNORECASE)
    text = re.sub(r"<p>(.*?)</p>", r"\1\n", text, flags=re.IGNORECASE | re.DOTALL)
    text = re.sub(r"<strong>(.*?)</strong>", r"<b>\1</b>", text, flags=re.IGNORECASE)
    text = re.sub(r"<b>(.*?)</b>", r"<b>\1</b>", text, flags=re.IGNORECASE)
    text = re.sub(r"<em>(.*?)</em>", r"<i>\1</i>", text, flags=re.IGNORECASE)
    text = re.sub(r"<i>(.*?)</i>", r"<i>\1</i>", text, flags=re.IGNORECASE)

    # Reemplazar listas <br>
    text = re.sub(r"<br\s*/?>", "\n", text, flags=re.IGNORECASE)
    text = re.sub(r"<li>(.*?)</li>", r"• \1\n", text, flags=re.IGNORECASE)

    # Quitar cualquier otra etiqueta HTML no soportada
    text = re.sub(r"<[^>]+>", "", text)

    # Limpiar múltiples espacios o saltos de línea consecutivos
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def format_product_caption(product: dict) -> str:
    """Genera el mensaje formateado en HTML para el producto."""
    name = product.get("name", "Producto sin nombre")
    sku = product.get("sku", "N/A")
    price = product.get("price", 0.0)
    price_suggested = product.get("priceSuggested", 0.0)
    stock = product.get("stock", 0)
    categories = ", ".join(product.get("categories", [])) or "General"
    in_bodega = product.get("inBodega", "IMPERIO BODEGA MAYORISTA")
    raw_desc = product.get("description", "")

    desc_cleaned = clean_html_for_telegram(raw_desc)

    # Construir texto del mensaje
    caption = f"📦 <b>{name.upper()}</b>\n"
    caption += f"🔑 <b>SKU:</b> <code>{sku}</code>\n"
    caption += f"🏷️ <b>Categoría:</b> {categories}\n"
    caption += f"💰 <b>Precio Mayorista:</b> <b>${price:.2f}</b>\n"
    if price_suggested and price_suggested > price:
        caption += f"💡 <b>PVP Sugerido:</b> ${price_suggested:.2f}\n"
    caption += f"📦 <b>Stock Disponible:</b> {stock} unidades\n"
    caption += f"🏬 <b>Bodega:</b> {in_bodega}\n\n"

    if desc_cleaned:
        caption += f"📝 <b>Descripción:</b>\n{desc_cleaned}\n"

    # Límite de caption en Telegram fotos es 1024 caracteres
    if len(caption) > 1000:
        caption = caption[:995] + "\n..."

    return caption


async def get_or_create_channel(client: TelegramClient) -> Channel:
    """Obtiene la entidad del canal @imporimperioshort."""
    print(f"🔍 Conectando con el canal @{CHANNEL_USERNAME}...")
    try:
        channel = await client.get_entity(CHANNEL_USERNAME)
        print(f"✅ Canal encontrado: '{channel.title}' (ID: {channel.id})")
        return channel
    except Exception as e:
        print(f"⚠️ Buscando por diálogo o título ('{CHANNEL_TITLE}')... ({e})")
        async for dialog in client.iter_dialogs():
            if dialog.is_channel and (dialog.title == CHANNEL_TITLE or dialog.name == CHANNEL_USERNAME):
                print(f"✅ Canal encontrado en diálogos: '{dialog.title}' (ID: {dialog.id})")
                return dialog.entity

    raise Exception(f"No se pudo encontrar el canal @{CHANNEL_USERNAME}. Asegurate de estar unido o ser administrador.")



import io
from urllib.parse import quote, urlparse, urlunparse


def download_image_bytes(url: str):
    """Descarga la imagen sanitizando espacios en la URL y retorna BytesIO para Telegram."""
    try:
        parsed = urlparse(url)
        encoded_path = quote(parsed.path)
        clean_url = urlunparse(
            (parsed.scheme, parsed.netloc, encoded_path, parsed.params, parsed.query, parsed.fragment)
        )
        resp = requests.get(clean_url, timeout=12)
        if resp.status_code == 200 and len(resp.content) > 100:
            img_io = io.BytesIO(resp.content)
            img_io.name = "producto.jpg"
            return img_io
    except Exception as e:
        print(f"  ⚠️ Error al descargar imagen: {e}")
    return None


async def main():
    test_mode = "--test" in sys.argv
    limit = 1 if test_mode else None

    print("🚀 Iniciando cliente de Telegram...")
    client = TelegramClient(SESSION_NAME, API_ID, API_HASH)
    await client.start()

    print("✅ Autenticado correctamente en Telegram.")
    channel = await get_or_create_channel(client)

    if not os.path.exists(JSON_PATH):
        print(f"❌ Error: No se encontró el archivo {JSON_PATH}")
        return

    with open(JSON_PATH, "r", encoding="utf-8") as f:
        productos = json.load(f)

    if limit:
        productos = productos[:limit]
        print(f"⚠️ Modo PRUEBA activo. Se publicará solo 1 producto.")

    total = len(productos)
    print(f"📦 Se procesarán {total} productos para enviar al canal...\n")

    exitosos = 0
    fallidos = 0

    for idx, prod in enumerate(productos, 1):
        name = prod.get("name", "Sin nombre")
        caption = format_product_caption(prod)
        images = prod.get("images", [])

        posted = False
        print(f"[{idx}/{total}] Publicando: {name}...")

        # Descargar la primera imagen si existe
        img_bytes = None
        if images and prod.get("hasImage"):
            img_bytes = download_image_bytes(images[0])

        if img_bytes:
            try:
                await client.send_file(
                    channel, img_bytes, caption=caption, parse_mode="html"
                )
                posted = True
            except errors.FloodWaitError as e:
                print(f"⏳ Límite de velocidad de Telegram. Esperando {e.seconds} segundos...")
                time.sleep(e.seconds + 2)
                try:
                    await client.send_file(
                        channel, img_bytes, caption=caption, parse_mode="html"
                    )
                    posted = True
                except Exception as ex:
                    print(f"⚠️ Falló reintento con imagen: {ex}")
            except Exception as e:
                print(f"⚠️ Error enviando foto ({e}), intentando enviar como texto...")

        # Si no había imagen o falló el envío de foto, enviar texto
        if not posted:
            try:
                await client.send_message(channel, caption, parse_mode="html")
                posted = True
            except errors.FloodWaitError as e:
                print(f"⏳ Límite de velocidad. Esperando {e.seconds} segundos...")
                time.sleep(e.seconds + 2)
                await client.send_message(channel, caption, parse_mode="html")
                posted = True
            except Exception as e:
                print(f"❌ Error al publicar {name}: {e}")

        if posted:
            exitosos += 1
        else:
            fallidos += 1

        # Pausa de seguridad entre productos (2.5s)
        time.sleep(2.5)

    print(f"\n✨ Finalizado: {exitosos} productos publicados correctamente, {fallidos} fallidos.")
    await client.disconnect()



if __name__ == "__main__":
    import asyncio

    asyncio.run(main())
