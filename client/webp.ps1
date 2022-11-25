Get-ChildItem "./src/assets/img/" -File -Recurse -Filter *.png | Foreach-Object {
	$wepb_filename = [System.IO.Path]::ChangeExtension($_.FullName,".webp")
	if (-not(Test-Path -Path $wepb_filename -PathType Leaf)) {
		Write-Output  $_.FullName => $wepb_filename
		ffmpeg -i $_.FullName $wepb_filename
	}
 }
