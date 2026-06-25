$GIT = "C:\Users\nedge\AppData\Local\GitHubDesktop\app-3.5.12\resources\app\git\cmd\git.exe"
$REPO = "C:\Users\nedge\Desktop\ppmonlineprojects"
$LOG  = "$REPO\push14_log.txt"

Set-Location $REPO

"Removing stale git locks..." | Out-File $LOG
if (Test-Path ".git\index.lock") { Remove-Item -Force ".git\index.lock" }
if (Test-Path ".git\HEAD.lock")  { Remove-Item -Force ".git\HEAD.lock"  }

"Staging files..." | Out-File $LOG -Append
& $GIT add `
    app/page.tsx `
    app/about/page.tsx `
    "app/buyers/investors/page.tsx" `
    "app/buyers/owner-occupiers/page.tsx" `
    app/blog/page.tsx `
    "app/blog/[slug]/page.tsx" `
    app/developer/page.tsx `
    app/full-disclaimer/page.tsx `
    app/insights/page.tsx `
    "app/more/[slug]/page.tsx" `
    app/off-the-plan-explainer/page.tsx `
    app/our-people/page.tsx `
    app/past-projects/page.tsx `
    app/privacy-policy/page.tsx `
    app/resources/page.tsx `
    app/testimonial/page.tsx 2>&1 | Out-File $LOG -Append

"Committing..." | Out-File $LOG -Append
& $GIT commit -m "fix: wrap all public page DB calls in try-catch so cold-start timeout never crashes the page" 2>&1 | Out-File $LOG -Append
"Commit exit: $LASTEXITCODE" | Out-File $LOG -Append

"Pushing to GitHub..." | Out-File $LOG -Append
& $GIT push "https://github.com/nedgerrard-ctrl/Propertied.git" main 2>&1 | Out-File $LOG -Append
"Push exit: $LASTEXITCODE" | Out-File $LOG -Append

"Last 3 commits:" | Out-File $LOG -Append
& $GIT log --oneline -3 2>&1 | Out-File $LOG -Append
"Done." | Out-File $LOG -Append
