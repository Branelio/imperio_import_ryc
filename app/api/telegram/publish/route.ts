import { NextResponse } from 'next/server'
import { spawn } from 'child_process'
import path from 'path'

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const isTest = body.testMode === true

    const projectRoot = process.cwd()
    const scriptPath = path.join(projectRoot, 'scripts', 'publish_catalog.py')

    const args = [scriptPath]
    if (isTest) {
      args.push('--test')
    }

    return new Promise<NextResponse>((resolve) => {
      // Intentar ejecutar con 'python' o 'py'
      let output = ''
      let errorOutput = ''

      const pyProcess = spawn('python', args, {
        cwd: projectRoot,
        env: { ...process.env, PYTHONIOENCODING: 'utf-8' },
      })

      pyProcess.stdout.on('data', (data) => {
        output += data.toString('utf-8')
      })

      pyProcess.stderr.on('data', (data) => {
        errorOutput += data.toString('utf-8')
      })

      pyProcess.on('error', (err) => {
        // Si 'python' falla por alguna razón en Windows, intentar retornar error informativo
        resolve(
          NextResponse.json(
            {
              success: false,
              message: `Error al iniciar script Python: ${err.message}`,
              output: output || errorOutput,
            },
            { status: 500 }
          )
        )
      })

      pyProcess.on('close', (code) => {
        if (code === 0) {
          resolve(
            NextResponse.json({
              success: true,
              message: isTest
                ? 'Publicación de prueba enviada a Telegram con éxito.'
                : 'Publicación completa enviada a Telegram con éxito.',
              output: output || 'Ejecución completada sin salida adicional.',
            })
          )
        } else {
          resolve(
            NextResponse.json(
              {
                success: false,
                message: `El script finalizó con código de salida ${code}`,
                output: output + '\n' + errorOutput,
              },
              { status: 500 }
            )
          )
        }
      })
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error?.message || 'Error interno del servidor.',
      },
      { status: 500 }
    )
  }
}
