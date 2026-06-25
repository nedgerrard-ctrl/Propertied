$root = 'C:\Users\nedge\Desktop\ppmonlineprojects\claude-design-preview'
$entry = 'ui_kits\website\index.html'
$port = 8100

# Kill anything already on 8100
$existing = (Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique)
if ($existing) {
    $existing | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }
    Start-Sleep -Milliseconds 500
}

$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

Write-Host "Preview server running at http://localhost:$port"
Write-Host "Opening Edge..."

Start-Process 'msedge' "http://localhost:$port/ui_kits/website/index.html"

Write-Host "Press Ctrl+C to stop."

while ($listener.IsListening) {
    try {
        $ctx = $listener.GetContext()
        $path = $ctx.Request.Url.LocalPath.TrimStart('/')
        if ($path -eq '' -or $path -eq '/') { $path = $entry }

        $file = Join-Path $root $path

        if (Test-Path $file -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($file)
            $ext = [System.IO.Path]::GetExtension($file).ToLower()
            $mimeMap = @{
                '.html' = 'text/html; charset=utf-8'
                '.js'   = 'application/javascript'
                '.jsx'  = 'application/javascript'
                '.css'  = 'text/css'
                '.mp4'  = 'video/mp4'
                '.svg'  = 'image/svg+xml'
                '.png'  = 'image/png'
                '.jpg'  = 'image/jpeg'
                '.woff2'= 'font/woff2'
                '.json' = 'application/json'
            }
            $mime = $mimeMap[$ext]
            if (-not $mime) { $mime = 'application/octet-stream' }
            $ctx.Response.ContentType = $mime
            $ctx.Response.ContentLength64 = $bytes.Length
            $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $ctx.Response.StatusCode = 404
            Write-Host "404: $path"
        }
        $ctx.Response.Close()
    } catch { }
}
