import { ZipReader, TextWriter, ReadableStreamReader } 
  from "https://unpkg.com/@zip.js/zip.js/dist/zip.js";

async function main() {
  const params = new URLSearchParams(location.search);
  const password = params.get("password") || "";
  const targetPath = params.get("path") || "";

  const zipUrl = "https://raw.githubusercontent.com/Timeree/Timeree/main/ai/private.zip";

  // 用流方式下载
  const resp = await fetch(zipUrl);
  if (!resp.body) {
    document.body.textContent = "该环境不支持流式读取";
    return;
  }

  // 用 ReadableStreamReader 包装响应流
  const reader = new ZipReader(new ReadableStreamReader(resp.body), { password });
  const entries = await reader.getEntries();

  const entry = entries.find(e => e.filename === targetPath);
  if (!entry) {
    document.body.textContent = "未找到文件: " + targetPath;
    return;
  }

  // 直接读取目标文件内容（边下载边解压）
  const text = await entry.getData(new TextWriter());
  const arr = text.split(/\r?\n/);

  document.body.textContent = JSON.stringify(arr, null, 2);

  await reader.close();
}
main();

// https://raw.githubusercontent.com/Timeree/Timeree/main/ai/read.html?password=123456&path=img