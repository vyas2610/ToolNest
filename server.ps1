param(
    [int]$Port = 8080,
    [string]$Directory = $PSScriptRoot
)

if (-not $Directory) {
    $Directory = (Get-Location).Path
}

$mimeTypes = @{
    ".html"  = "text/html; charset=utf-8"
    ".htm"   = "text/html; charset=utf-8"
    ".css"   = "text/css; charset=utf-8"
    ".js"    = "application/javascript; charset=utf-8"
    ".json"  = "application/json; charset=utf-8"
    ".svg"   = "image/svg+xml"
    ".png"   = "image/png"
    ".jpg"   = "image/jpeg"
    ".jpeg"  = "image/jpeg"
    ".webp"  = "image/webp"
    ".gif"   = "image/gif"
    ".ico"   = "image/x-icon"
    ".pdf"   = "application/pdf"
    ".xml"   = "application/xml; charset=utf-8"
    ".txt"   = "text/plain; charset=utf-8"
    ".woff"  = "font/woff"
    ".woff2" = "font/woff2"
    ".ttf"   = "font/ttf"
}

$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$Port/"
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
    Write-Host "ToolNest server running at $prefix"
    Write-Host "Root: $Directory"
} catch {
    Write-Error "Failed to start listener on port $Port : $_"
    exit 1
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $req = $context.Request
        $res = $context.Response
        
        try {
            $rawPath = [System.Uri]::UnescapeDataString($req.Url.AbsolutePath)
            if ($rawPath.EndsWith("/")) {
                $rawPath += "index.html"
            }
            
            $relPath = $rawPath.TrimStart("/").Replace("/", [System.IO.Path]::DirectorySeparatorChar)
            $filePath = [System.IO.Path]::Combine($Directory, $relPath)
            
            if ([System.IO.Directory]::Exists($filePath)) {
                $filePath = [System.IO.Path]::Combine($filePath, "index.html")
            }
            
            if (-not [System.IO.File]::Exists($filePath)) {
                if ([System.IO.File]::Exists("$filePath.html")) {
                    $filePath = "$filePath.html"
                }
            }
            
            if ([System.IO.File]::Exists($filePath)) {
                $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
                $contentType = "application/octet-stream"
                if ($mimeTypes.ContainsKey($ext)) {
                    $contentType = $mimeTypes[$ext]
                }
                
                $bytes = [System.IO.File]::ReadAllBytes($filePath)
                $res.ContentType = $contentType
                $res.ContentLength64 = $bytes.Length
                $res.StatusCode = 200
                $res.AddHeader("Access-Control-Allow-Origin", "*")
                $res.AddHeader("Cache-Control", "no-cache")
                if ($req.HttpMethod -ne "HEAD") {
                    $res.OutputStream.Write($bytes, 0, $bytes.Length)
                }
            } else {
                $custom404 = [System.IO.Path]::Combine($Directory, "404.html")
                if ([System.IO.File]::Exists($custom404)) {
                    $bytes = [System.IO.File]::ReadAllBytes($custom404)
                    $res.ContentType = "text/html; charset=utf-8"
                    $res.ContentLength64 = $bytes.Length
                    $res.StatusCode = 404
                    if ($req.HttpMethod -ne "HEAD") {
                        $res.OutputStream.Write($bytes, 0, $bytes.Length)
                    }
                } else {
                    $res.StatusCode = 404
                    $bytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
                    $res.ContentLength64 = $bytes.Length
                    if ($req.HttpMethod -ne "HEAD") {
                        $res.OutputStream.Write($bytes, 0, $bytes.Length)
                    }
                }
            }
        } catch {
            try { $res.StatusCode = 500 } catch {}
        } finally {
            try { $res.OutputStream.Close() } catch {}
        }
    }
} finally {
    $listener.Stop()
    $listener.Close()
}
