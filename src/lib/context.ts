export class Context {
  constructor(public event: MessageEvent) {}

  public getRawData() {
    return this.event.data;
  }
  
  public getJson() {
    try {
      const json = JSON.parse(this.event.data);
      return json;
    } catch (e) {
      return null;
    }
  }

  public getBlob(options?: BlobPropertyBag) {
    return new Blob([this.event.data], options);
  }

  public getDataURL() {
    return new Promise(resolve => {
      const fr = new FileReader();
      fr.addEventListener('loadend', () => {
        resolve(fr.result);
      });
      fr.readAsDataURL(this.getBlob());
    });
  }

}
