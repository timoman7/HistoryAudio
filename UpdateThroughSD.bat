@echo off
set _home_=%2
echo Working from: %_home_%
echo Writing in: %1
((dir /A:D /B | find /V ".prn") | find /V "_EXCLUDE") > folders.prn
(dir /A:-D /B | find /V ".prn") > files.prn
for /d %%i in (%1*) do (
cd %%i
call %_home_%\UpdateThroughSD.bat .\ %_home_%
cd %_home_%
)