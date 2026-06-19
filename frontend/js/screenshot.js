async function copyReport(button) {

    const report =
        button.closest(".report");

    const canvas =
        await html2canvas(report);

    canvas.toBlob(async (blob) => {

        await navigator.clipboard.write([

            new ClipboardItem({
                "image/png": blob
            })

        ]);

    });

}