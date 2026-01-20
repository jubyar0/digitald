$settingsFiles = @(
    "C:\Users\Hossame\Desktop\Dig\apps\web\app\(dashboard)\seller\settings\page.tsx",
    "C:\Users\Hossame\Desktop\Dig\apps\web\app\(dashboard)\seller\settings\apps\page.tsx",
    "C:\Users\Hossame\Desktop\Dig\apps\web\app\(dashboard)\seller\settings\billing\page.tsx",
    "C:\Users\Hossame\Desktop\Dig\apps\web\app\(dashboard)\seller\settings\billing\profile\page.tsx",
    "C:\Users\Hossame\Desktop\Dig\apps\web\app\(dashboard)\seller\settings\brand\page.tsx",
    "C:\Users\Hossame\Desktop\Dig\apps\web\app\(dashboard)\seller\settings\checkout\page.tsx",
    "C:\Users\Hossame\Desktop\Dig\apps\web\app\(dashboard)\seller\settings\customer-accounts\page.tsx",
    "C:\Users\Hossame\Desktop\Dig\apps\web\app\(dashboard)\seller\settings\customer-events\page.tsx",
    "C:\Users\Hossame\Desktop\Dig\apps\web\app\(dashboard)\seller\settings\customer-privacy\page.tsx",
    "C:\Users\Hossame\Desktop\Dig\apps\web\app\(dashboard)\seller\settings\domains\page.tsx",
    "C:\Users\Hossame\Desktop\Dig\apps\web\app\(dashboard)\seller\settings\general\page.tsx",
    "C:\Users\Hossame\Desktop\Dig\apps\web\app\(dashboard)\seller\settings\languages\page.tsx",
    "C:\Users\Hossame\Desktop\Dig\apps\web\app\(dashboard)\seller\settings\locations\page.tsx",
    "C:\Users\Hossame\Desktop\Dig\apps\web\app\(dashboard)\seller\settings\metafields\page.tsx",
    "C:\Users\Hossame\Desktop\Dig\apps\web\app\(dashboard)\seller\settings\notifications\page.tsx",
    "C:\Users\Hossame\Desktop\Dig\apps\web\app\(dashboard)\seller\settings\notifications\customer\page.tsx",
    "C:\Users\Hossame\Desktop\Dig\apps\web\app\(dashboard)\seller\settings\notifications\fulfillment\page.tsx",
    "C:\Users\Hossame\Desktop\Dig\apps\web\app\(dashboard)\seller\settings\notifications\staff\page.tsx",
    "C:\Users\Hossame\Desktop\Dig\apps\web\app\(dashboard)\seller\settings\notifications\webhooks\page.tsx",
    "C:\Users\Hossame\Desktop\Dig\apps\web\app\(dashboard)\seller\settings\payments\page.tsx",
    "C:\Users\Hossame\Desktop\Dig\apps\web\app\(dashboard)\seller\settings\payout-methods\page.tsx",
    "C:\Users\Hossame\Desktop\Dig\apps\web\app\(dashboard)\seller\settings\plan\page.tsx",
    "C:\Users\Hossame\Desktop\Dig\apps\web\app\(dashboard)\seller\settings\plan\pick\page.tsx",
    "C:\Users\Hossame\Desktop\Dig\apps\web\app\(dashboard)\seller\settings\policies\page.tsx",
    "C:\Users\Hossame\Desktop\Dig\apps\web\app\(dashboard)\seller\settings\profile\page.tsx",
    "C:\Users\Hossame\Desktop\Dig\apps\web\app\(dashboard)\seller\settings\sales-channels\page.tsx",
    "C:\Users\Hossame\Desktop\Dig\apps\web\app\(dashboard)\seller\settings\shipping\page.tsx",
    "C:\Users\Hossame\Desktop\Dig\apps\web\app\(dashboard)\seller\settings\storefront\page.tsx",
    "C:\Users\Hossame\Desktop\Dig\apps\web\app\(dashboard)\seller\settings\tax\page.tsx",
    "C:\Users\Hossame\Desktop\Dig\apps\web\app\(dashboard)\seller\settings\users\page.tsx",
    "C:\Users\Hossame\Desktop\Dig\apps\web\app\(dashboard)\seller\settings\users\roles\page.tsx",
    "C:\Users\Hossame\Desktop\Dig\apps\web\app\(dashboard)\seller\settings\users\security\page.tsx",
    "C:\Users\Hossame\Desktop\Dig\apps\web\app\(dashboard)\seller\marketing\page.tsx",
    "C:\Users\Hossame\Desktop\Dig\apps\web\app\(dashboard)\seller\messages\page.tsx",
    "C:\Users\Hossame\Desktop\Dig\apps\web\app\(dashboard)\seller\orders\pending\page.tsx",
    "C:\Users\Hossame\Desktop\Dig\apps\web\app\(dashboard)\seller\orders\completed\page.tsx",
    "C:\Users\Hossame\Desktop\Dig\apps\web\app\(dashboard)\seller\orders\returns\page.tsx",
    "C:\Users\Hossame\Desktop\Dig\apps\web\app\(dashboard)\seller\reviews\page.tsx",
    "C:\Users\Hossame\Desktop\Dig\apps\web\app\(dashboard)\seller\products\inventory\page.tsx"
)

$updated = 0
$skipped = 0
$errors = 0

foreach ($file in $settingsFiles) {
    if (Test-Path $file) {
        try {
            $content = Get-Content $file -Raw
            if ($content -notmatch "export const dynamic") {
                $lines = Get-Content $file
                $lastImportIndex = -1
                
                for ($i = 0; $i -lt $lines.Count; $i++) {
                    if ($lines[$i] -match "^import ") {
                        $lastImportIndex = $i
                    }
                }
                
                if ($lastImportIndex -ge 0) {
                    $newLines = @()
                    $newLines += $lines[0..$lastImportIndex]
                    $newLines += ""
                    $newLines += "export const dynamic = 'force-dynamic'"
                    if ($lastImportIndex + 1 -lt $lines.Count) {
                        $newLines += $lines[($lastImportIndex + 1)..($lines.Count - 1)]
                    }
                    $newLines | Set-Content $file -Encoding UTF8
                    $updated++
                    Write-Host "✓ Updated: $($file.Split('\')[-1])"
                } else {
                    Write-Host "⚠ No imports found in: $($file.Split('\')[-1])"
                    $errors++
                }
            } else {
                $skipped++
            }
        } catch {
            Write-Host "✗ Error processing: $($file.Split('\')[-1]) - $($_.Exception.Message)"
            $errors++
        }
    } else {
        Write-Host "✗ File not found: $file"
        $errors++
    }
}

Write-Host "`n=== Summary ==="
Write-Host "✓ Updated: $updated files"
Write-Host "○ Skipped: $skipped files (already have export)"
if ($errors -gt 0) {
    Write-Host "✗ Errors: $errors files"
}
