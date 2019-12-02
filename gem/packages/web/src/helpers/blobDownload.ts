const blobDownload = (blob: any, name: string) => {
    let a = document.createElement("a");
    a.href = window.URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};

export default blobDownload;
