param()
$source = 'c:\Users\Acer\OneDrive\Desktop\Mumbai Road_Safety'
$dest = 'c:\Users\Acer\OneDrive\Desktop\RoadSafe_Mumbai_Project.zip'

if (Test-Path $dest) { Remove-Item $dest -Force }

Add-Type -AssemblyName 'System.IO.Compression.FileSystem'

$exclude = @('node_modules', 'target', '__pycache__', '.git', 'dist')

$files = Get-ChildItem -Path $source -Recurse -File | Where-Object {
    $path = $_.FullName
    $skip = $false
    foreach ($ex in $exclude) {
        if ($path -like "*\$ex\*" -or $path -like "*\$ex") { $skip = $true; break }
    }
    -not $skip
}

Write-Host "Files to zip: $($files.Count)"

$zip = [System.IO.Compression.ZipFile]::Open($dest, 'Create')
foreach ($file in $files) {
    $relativePath = $file.FullName.Substring($source.Length + 1)
    $entry = $zip.CreateEntry($relativePath)
    $stream = $entry.Open()
    $fileStream = [System.IO.File]::OpenRead($file.FullName)
    $fileStream.CopyTo($stream)
    $fileStream.Close()
    $stream.Close()
}
$zip.Dispose()
$sizeMB = [Math]::Round((Get-Item $dest).Length / 1MB, 2)
Write-Host "ZIP created at: $dest ($sizeMB MB)"
