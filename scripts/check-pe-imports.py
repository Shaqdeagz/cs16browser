"""Report unavailable Windows DLL imports without executing the test binary."""
import ctypes
from pathlib import Path
import pefile

for path in Path('src-tauri/target/debug/deps').glob('cs16browser_lib-*.exe'):
    print(f'Inspecting {path}', flush=True)
    pe = pefile.PE(str(path))
    for entry in getattr(pe, 'DIRECTORY_ENTRY_IMPORT', []):
        name = entry.dll.decode()
        try:
            dll = ctypes.WinDLL(name)
        except OSError as error:
            print(f'DLL LOAD FAILED: {name}: {error}', flush=True)
            continue
        missing = []
        for symbol in entry.imports:
            key = symbol.name.decode() if symbol.name else symbol.ordinal
            try:
                dll[key]
            except (AttributeError, OSError):
                missing.append(key)
        print(f'{name}: {len(entry.imports)} imports; MISSING: {missing}', flush=True)
