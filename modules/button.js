class Button {
  constructor(x, y, width, height, label, labelSize) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.label = label;
    this.labelSize = labelSize;
  }

  draw(func) {
    this.click(func);

    if (this.hover()) {
      if (mouseIsPressed) {
        fill(100, 100, 255);
      } else {
        fill(100);
      }
    } else {
      fill(0);
    }

    rect(this.x, this.y, this.width, this.height);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(this.labelSize);
    text(this.label, this.x + this.width * 0.5, this.y + this.height * 0.55);
  }

  hover() {
    if (mouseX > this.x && mouseY > this.y && mouseX < this.width + this.x && mouseY < this.height + this.y) {
      return true;
    }

    return false;
  }

  click(func) {
    if (mouseX > this.x && mouseY > this.y && mouseX < this.width + this.x && mouseY < this.height + this.y) {
      if (mouseIsPressed) {
        func();
      }
    }
  }
}
