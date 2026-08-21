// Mock for jsPDF in Jest environment
class jsPDFMock {
  constructor() {
    this.text = () => this;
    this.save = () => this;
    this.autoTable = () => this;
  }
}

export default jsPDFMock;
export const jsPDF = jsPDFMock;
