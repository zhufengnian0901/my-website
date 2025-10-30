class TypingEffect {
    constructor(element, text, speed = 50) {
        this.element = element;
        this.text = text;
        this.speed = speed;
        this.currentIndex = 0;
        this.isTyping = false;
    }

    start() {
        this.isTyping = true;
        this.currentIndex = 0;
        this.element.innerHTML = '';
        this.typeCharacter();
    }

    typeCharacter() {
        if (this.currentIndex < this.text.length && this.isTyping) {
            this.element.innerHTML = this.text.substring(0, this.currentIndex + 1) + 
                                   '<span class="typing-cursor"></span>';
            this.currentIndex++;
            setTimeout(() => this.typeCharacter(), this.speed);
        } else {
            this.element.innerHTML = this.text;
        }
    }

    stop() {
        this.isTyping = false;
    }

    skip() {
        this.stop();
        this.element.innerHTML = this.text;
    }
}