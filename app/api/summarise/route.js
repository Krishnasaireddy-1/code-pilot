import { spawn } from 'child_process';

export async function POST(req) {
  try {
    const body = await req.json();
    const userCode = body.code;

    return new Promise((resolve, reject) => {
      const python = spawn('python', [
        'C:\\Users\\krishna sai reddy\\Desktop\\codepilot\\codeSummarisation\\main.py',
        userCode
      ]);

      let output = '';
      let error = '';

      python.stdout.on('data', (data) => {
        output += data.toString();
      });

      python.stderr.on('data', (data) => {
        error += data.toString();
      });

      python.on('close', (code) => {
        console.log(`Python process closed with code ${code}`);
        console.log('stdout:', output);
        console.log('stderr:', error);

        if (code !== 0) {
          return reject(
            new Response(JSON.stringify({ error: error.trim() || 'Python script failed' }), { status: 500 })
          );
        }

        // If there's no output, send an empty response to avoid errors
        if (!output.trim()) {
          return reject(
            new Response(JSON.stringify({ error: 'No output from Python script' }), { status: 500 })
          );
        }

        resolve(
          new Response(JSON.stringify({ summary: output.trim() }), { status: 200 })
        );
      });
    });
  } catch (err) {
    console.error('Internal server error:', err);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}
