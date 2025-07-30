# HTML 파일 수정 스크립트
$content = Get-Content "index.html" -Raw -Encoding UTF8
$content = $content -replace 'class="approach-section pt-4 pb-4"', 'class="approach-section" style="margin-top: 2rem; margin-bottom: 2rem;"'
$content | Set-Content "index.html" -Encoding UTF8
Write-Host "수정 완료!"
