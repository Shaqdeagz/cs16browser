fn main() {
    let attributes = tauri_build::Attributes::new();
    #[cfg(windows)]
    let attributes = {
        // Tauri's default resource only reaches app binaries. Its test harness
        // then loads Common Controls v5, which lacks TaskDialogIndirect and
        // exits with STATUS_ENTRYPOINT_NOT_FOUND before any tests execute.
        // Link the same default manifest into all artifacts, including tests.
        // https://github.com/tauri-apps/tauri/issues/13419
        let manifest = std::path::PathBuf::from(std::env::var_os("CARGO_MANIFEST_DIR").unwrap())
            .join("windows-app-manifest.xml");
        println!("cargo:rerun-if-changed={}", manifest.display());
        println!("cargo:rustc-link-arg=/MANIFEST:EMBED");
        println!("cargo:rustc-link-arg=/MANIFESTINPUT:{}", manifest.display());
        attributes.windows_attributes(tauri_build::WindowsAttributes::new_without_app_manifest())
    };
    tauri_build::try_build(attributes).expect("Tauri build failed");
}
