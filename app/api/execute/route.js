import { NextResponse } from "next/server";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import util from "util";
import os from "os";

const execPromise = util.promisify(exec);

export async function POST(req) {
  try {
    const { code, input, language } = await req.json();

    // Define file extensions
    const fileExtensions = {
      javascript: "js",
      python: "py",
      cpp: "cpp",
      java: "java",
    };

    if (!fileExtensions[language]) {
      return NextResponse.json({ output: "Unsupported language" }, { status: 400 });
    }

    // Create a unique temp directory
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "code-runner-"));
    const ext = fileExtensions[language];
    const filePath = path.join(tempDir, `temp.${ext}`);
    const inputPath = path.join(tempDir, "input.txt");

    // Write code and input to files
    fs.writeFileSync(filePath, code);
    fs.writeFileSync(inputPath, input || "");

    let command;
    switch (language) {
      case "javascript":
        command = `node "${filePath}" < "${inputPath}"`;
        break;
      case "python":
        command = `python "${filePath}" < "${inputPath}"`;
        break;
      case "cpp":
        const outputExe = path.join(tempDir, "temp.exe");
        command = `g++ "${filePath}" -o "${outputExe}" && "${outputExe}" < "${inputPath}"`;
        break;
      case "java":
        // Ensure Java class name is Main
        const javaFilePath = path.join(tempDir, "Main.java");
        fs.writeFileSync(javaFilePath, code.replace(/class\s+\w+/, "class Main"));
        command = `javac "${javaFilePath}" && java -cp "${tempDir}" Main < "${inputPath}"`;
        break;
    }

    const { stdout, stderr } = await execPromise(command);
    
    // Cleanup temp directory
    fs.rmSync(tempDir, { recursive: true, force: true });

    return NextResponse.json({ output: stdout || stderr });

  } catch (error) {
    return NextResponse.json({ output: error.message }, { status: 500 });
  }
}
