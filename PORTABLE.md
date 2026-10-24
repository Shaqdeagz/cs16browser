# CS 1.6 Browser — custom portable Windows x64

Extract the ZIP into a writable folder. Double-click cs16browser-portable.exe.
No application installation is needed. Requires Windows 11 x64 and Microsoft
Edge WebView2 Runtime (normally already present). The EXE is unsigned.

On first launch, Settings opens. Supply your own Steam Web API key to discover
servers using the linked Steam page. Steam and Counter-Strike 1.6 are needed
to join through steam://connect; they are not needed to browse.

Name and Game are independent, case-insensitive substring filters. Commas
separate alternatives: classic,dust includes either word. A leading ! excludes
text: !www,!discord,!VIP excludes all three. Exclusions override includes.
Map, ping, security and original checkbox filters still work.
Right-click a located server to filter by its country or continent. Clear the
filter from the menu or the Location/Clear button in the filter panel.
Unknown countries do not match location filters. IP locations are approximate;
Russia is grouped under Europe; Turkey under Asia.

Filters, favorites and history are remembered in the Windows WebView2 profile.
Backend settings/cache/state are stored beside the EXE. Keep the folder
writable. The browser profile is not fully self-contained in this ZIP.
Do not share settings.json: it contains your Steam API key.
Both automatic and manual upstream updates are disabled.

Fake-server, redirect, bot-plugin and player-count heuristics are preserved.
Passing checks does not guarantee real human players; servers can misreport.
Defaults show secure servers below 100 ms; the optional checkboxes can hide
bots, empty/full/passworded servers.
Adjust filters if the list looks unexpectedly small.

SOURCE.txt identifies the corresponding GPL-3.0-or-later source, also included
as source.zip. SHA256.txt covers the EXE. VERIFICATION.txt records PE and launch checks.
