import { styles } from './assets.js';
// import './style.scss';

class NetEasyWidget extends HTMLElement {
  #scriptData = document.getElementById('net-easy-widget').dataset.new;
  #scriptObject = JSON.parse(this.#scriptData.replace(/'/g, '"'));
  #delay = this.#scriptObject['delay'];
  #closeButton = null;

  constructor () {
    super();

    // {social: 'instagram', user: 'instagram', color: '#444857'}
    this.attachShadow({ mode: 'open' }); // Включаем Shadow DOM
    this.initialize();
    this.injectStyles();

    setTimeout(() => {
      // close function
      this.#closeButton = this.widgetContainer.querySelector('.iec__close-button');
      this.#closeButton.addEventListener('click', () => {
        this.widgetContainer.querySelector('.iec').classList.add('iec--hidden');
        setTimeout(() => {
          this.widgetContainer.remove();
        }, 500);
      });

      if (this.widgetContainer) {
        this.widgetContainer.querySelector('.iec').classList.remove('iec--hidden');
      }
    }, this.#delay * 1000);
  }

  widgetContainer = null;

  initialize () {
    this.widgetContainer = document.createElement('div');

    this.createWidgetContent();
    this.shadowRoot.appendChild(this.widgetContainer);
  }

  createWidgetContent () {
    const social = this.#scriptObject.social;
    const userName = this.#scriptObject.user;

    const backgroundColor = this.#scriptObject['background-color'] ?? '#444857';
    const textCTA = this.#scriptObject['text-cta'] ?? 'Нужна помощь?';
    const textOffer = this.#scriptObject['text-offer'] ?? 'Пишите в&nbsp;Instagram';
    const hiddenClassIsDelay = this.#delay > 0 ? 'iec--hidden' : '';

    const link = this.#getLink()[social] + userName;
    this.widgetContainer.innerHTML = `
        <div class="iec ${hiddenClassIsDelay}">
           <a href="${link}" class="iec__link" target="_blank">
            <div class="iec__cta" style="background-color: ${backgroundColor}">
              ${textCTA}
              <span>${textOffer}</span>
            </div>
            <div class="iec__icon">
              <svg width="744" height="744" viewBox="0 0 744 744" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M372.202 0.401917C271.226 0.401917 258.554 0.842983 218.894 2.64657C179.312 4.45772 152.294 10.7197 128.653 19.9077C104.199 29.3969 83.4552 42.0909 62.7891 62.7494C42.1075 83.4007 29.4038 104.129 19.8763 128.557C10.6584 152.188 4.38404 179.194 2.60275 218.731C0.829019 258.361 0.364136 271.032 0.364136 371.933C0.364136 472.835 0.813519 485.459 2.61031 525.089C4.43091 564.642 10.6974 591.64 19.8839 615.263C29.3883 639.699 42.0916 660.427 62.7657 681.078C83.4246 701.745 104.168 714.47 128.607 723.959C152.263 733.147 179.289 739.409 218.863 741.22C258.523 743.023 271.187 743.465 372.156 743.465C473.14 743.465 485.774 743.024 525.434 741.22C565.016 739.409 592.065 733.147 615.721 723.959C640.167 714.47 660.88 701.745 681.539 681.078C702.22 660.427 714.924 639.699 724.451 615.271C733.591 591.64 739.866 564.634 741.725 525.097C743.506 485.467 743.971 472.835 743.971 371.933C743.971 271.031 743.506 258.369 741.725 218.738C739.866 179.186 733.591 152.188 724.451 128.565C714.924 104.129 702.22 83.4004 681.539 62.7494C660.857 42.0829 640.175 29.389 615.698 19.9073C591.995 10.7197 564.961 4.45772 525.38 2.64657C485.72 0.842983 473.094 0.401917 372.086 0.401917H372.202ZM338.848 67.3551C348.748 67.3396 359.793 67.3551 372.202 67.3551C471.475 67.3551 483.241 67.7112 522.444 69.4913C558.695 71.1479 578.37 77.2004 591.476 82.2858C608.827 89.0198 621.197 97.0698 634.203 110.073C647.216 123.077 655.272 135.461 662.026 152.799C667.116 165.88 673.181 185.541 674.83 221.765C676.612 260.93 676.999 272.696 676.999 371.848C676.999 471 676.612 482.766 674.83 521.931C673.173 558.156 667.116 577.816 662.026 590.897C655.288 608.235 647.216 620.581 634.203 633.576C621.19 646.58 608.835 654.63 591.476 661.364C578.385 666.473 558.695 672.51 522.444 674.166C483.249 675.947 471.475 676.334 372.202 676.334C272.922 676.334 261.156 675.947 221.961 674.166C185.71 672.495 166.036 666.442 152.921 661.356C135.57 654.622 123.176 646.572 110.164 633.569C97.1503 620.565 89.0946 608.212 82.3398 590.866C77.2507 577.785 71.1857 558.125 69.5359 521.9C67.7543 482.735 67.3978 470.97 67.3978 371.755C67.3978 272.541 67.7543 260.837 69.5359 221.672C71.1936 185.448 77.2507 165.788 82.3398 152.691C89.0787 135.353 97.1503 122.969 110.164 109.965C123.176 96.9613 135.57 88.9117 152.921 82.1622C166.028 77.0534 185.71 71.0164 221.961 69.3518C256.26 67.8038 269.553 67.3396 338.848 67.2618L338.848 67.3551ZM570.67 129.045C546.038 129.045 526.053 148.991 526.053 173.613C526.053 198.227 546.038 218.197 570.67 218.197C595.302 218.197 615.287 198.227 615.287 173.613C615.287 148.999 595.302 129.029 570.67 129.029L570.67 129.045ZM372.202 181.136C266.756 181.136 181.264 266.565 181.264 371.933C181.264 477.301 266.756 562.691 372.202 562.691C477.649 562.691 563.11 477.301 563.11 371.933C563.11 266.565 477.641 181.136 372.195 181.136H372.202ZM372.202 248.09C440.646 248.09 496.138 303.533 496.138 371.933C496.138 440.326 440.646 495.777 372.202 495.777C303.751 495.777 248.267 440.326 248.267 371.933C248.267 303.533 303.751 248.09 372.202 248.09Z"
                  fill="white" />
              </svg>
            </div>
          </a>
          <button class="iec__close-button" type="button">
            <span class="visually-hidden">Закрыть</span>
          </button>
        </div>
    `;
  }

  injectStyles () {
    const styleTag = document.createElement('style');
    styleTag.innerHTML = styles.replace(/^\s+|\n/gm, '');
    this.shadowRoot.appendChild(styleTag);
  }

  #getLink () {
    return {
      'instagram': 'https://www.instagram.com/',
    };
  }
}

// Регистрация пользовательского элемента
customElements.define('net-easy-widget', NetEasyWidget);

// Использование элемента с передачей свойства
const widget = document.createElement('net-easy-widget');
document.body.appendChild(widget);
