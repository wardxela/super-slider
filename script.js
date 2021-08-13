class SLider {
  constructor(id) {
    this.root = document.querySelector(`#${id}`);
    this.frame = this.root.querySelector("[data-slider-frame]");
    this.container = this.root.querySelector("[data-slider-container]");
    this.prevBtn = this.root.querySelector('[data-slider-controller="prev"]');
    this.nextBtn = this.root.querySelector('[data-slider-controller="next"]');

    const firstSlide = this.container.firstElementChild.cloneNode(true);
    const lastSlide = this.container.lastElementChild.cloneNode(true);

    this.container.append(firstSlide);
    this.container.prepend(lastSlide);

    this.slidesCount = this.container.childElementCount;
    this.currentSlide = 1;
    this.offset = 100;
    this.threshold = 10;

    this.changeSlide(1);

    let initPos = null;
    let currentPos = null;

    const dragStart = e => {
      e.preventDefault();
      if (e.type === "touchstart") {
        initPos = e.touches[0].clientX;
      } else {
        initPos = e.clientX;
        document.addEventListener("mousemove", dragMove);
        document.addEventListener("mouseup", dragEnd);
      }
    };

    const dragMove = e => {
      if (e.type === "touchmove") {
        currentPos =
          ((initPos - e.touches[0].clientX) / this.container.offsetWidth) * 100;
      } else {
        currentPos = ((initPos - e.clientX) / this.container.offsetWidth) * 100;
      }

      this.container.style.left = `-${
        this.currentSlide * this.offset + currentPos
      }%`;
    };

    const dragEnd = e => {
      if (e.type !== "touchend") {
        document.removeEventListener("mousemove", dragMove);
        document.removeEventListener("mouseup", dragEnd);
      }

      this.container.classList.add("s-slider-effect");

      if (currentPos > this.threshold) {
        this.next();
      } else if (currentPos < -this.threshold) {
        this.prev();
      } else {
        this.changeSlide(this.currentSlide);
      }
    };

    this.frame.addEventListener("dragstart", dragStart);
    this.frame.addEventListener("touchstart", dragStart);
    this.frame.addEventListener("touchmove", dragMove);
    this.frame.addEventListener("touchend", dragEnd);

    this.container.addEventListener("transitionstart", e => {
      this.prevBtn.disabled = this.nextBtn.disabled = true;
      this.frame.removeEventListener("dragstart", dragStart);
      this.frame.removeEventListener("touchstart", dragStart);
      this.frame.removeEventListener("touchmove", dragMove);
      this.frame.removeEventListener("touchend", dragEnd);
    });

    this.container.addEventListener("transitionend", e => {
      this.container.classList.remove("s-slider-effect");

      if (this.currentSlide === 0) {
        this.changeSlide(this.slidesCount - 2);
      } else if (this.currentSlide === this.slidesCount - 1) {
        this.changeSlide(1);
      }

      this.prevBtn.disabled = this.nextBtn.disabled = false;
      this.frame.addEventListener("dragstart", dragStart);
      this.frame.addEventListener("touchstart", dragStart);
      this.frame.addEventListener("touchmove", dragMove);
      this.frame.addEventListener("touchend", dragEnd);
    });

    this.prevBtn.addEventListener("click", e => {
      this.container.classList.add("s-slider-effect");
      this.prev();
    });

    this.nextBtn.addEventListener("click", e => {
      this.container.classList.add("s-slider-effect");
      this.next();
    });
  }

  changeSlide(newSlide) {
    this.currentSlide = newSlide;
    this.container.style.left = `-${this.currentSlide * this.offset}%`;
  }

  prev() {
    this.changeSlide(this.currentSlide - 1);
  }

  next() {
    this.changeSlide(this.currentSlide + 1);
  }
}

const slider = new SLider("slider");
