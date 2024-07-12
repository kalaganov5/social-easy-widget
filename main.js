import { styles } from './assets.js';

// import './style.scss';

class NetEasyWidget extends HTMLElement {
  #scriptData = document.getElementById('net-easy-widget').dataset.new;
  #scriptObject = JSON.parse(this.#scriptData.replace(/'/g, '"'));
  #delay = this.#scriptObject['delay'];
  #closeButton = null;
  widgetContainer = null;

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

  initialize () {
    this.widgetContainer = document.createElement('div');

    this.createWidgetContent();
    this.shadowRoot.appendChild(this.widgetContainer);
  }

  createWidgetContent () {
    const social = this.#scriptObject.social;
    const userName = this.#scriptObject.user;

    if (!social || !userName) {
      console.error('Проверьте настройки виджета');
      return;
    }

    const isAnimationDisabled = Boolean(this.#scriptObject['isAnimationDisabled']);
    const backgroundColor = this.#scriptObject['background-color'] ? this.#scriptObject['background-color'] : '#444857';
    const textCTA = this.#scriptObject['text-cta'] ? this.#scriptObject['text-cta'] : 'Нужна помощь?';
    const textOffer = this.#scriptObject['text-offer'] ? this.#scriptObject['text-offer'] : 'Пишите в ' + this.#getSocialData()[social]['socialName'];
    const hiddenClassIsDelay = this.#delay > 0 ? 'iec--hidden' : '';

    const link = this.#getSocialData()[social]['link'] + userName;
    const icon = this.#getSocialData()[social]['icon'];
    const background = this.#getSocialData()[social]['backgroundIconColor'];
    const brandColor = this.#getSocialData()[social]['brandColor'];

    this.widgetContainer.innerHTML = `
        <div class="iec ${hiddenClassIsDelay}">
        <style> @import "style.scss"; </style>
         <div style="display: none">
            <svg width="0" height="0">
               <symbol fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 744 744" id="instagram">
                  <path d="M372.202 0.401917C271.226 0.401917 258.554 0.842983 218.894 2.64657C179.312 4.45772 152.294 10.7197 128.653 19.9077C104.199 29.3969 83.4552 42.0909 62.7891 62.7494C42.1075 83.4007 29.4038 104.129 19.8763 128.557C10.6584 152.188 4.38404 179.194 2.60275 218.731C0.829019 258.361 0.364136 271.032 0.364136 371.933C0.364136 472.835 0.813519 485.459 2.61031 525.089C4.43091 564.642 10.6974 591.64 19.8839 615.263C29.3883 639.699 42.0916 660.427 62.7657 681.078C83.4246 701.745 104.168 714.47 128.607 723.959C152.263 733.147 179.289 739.409 218.863 741.22C258.523 743.023 271.187 743.465 372.156 743.465C473.14 743.465 485.774 743.024 525.434 741.22C565.016 739.409 592.065 733.147 615.721 723.959C640.167 714.47 660.88 701.745 681.539 681.078C702.22 660.427 714.924 639.699 724.451 615.271C733.591 591.64 739.866 564.634 741.725 525.097C743.506 485.467 743.971 472.835 743.971 371.933C743.971 271.031 743.506 258.369 741.725 218.738C739.866 179.186 733.591 152.188 724.451 128.565C714.924 104.129 702.22 83.4004 681.539 62.7494C660.857 42.0829 640.175 29.389 615.698 19.9073C591.995 10.7197 564.961 4.45772 525.38 2.64657C485.72 0.842983 473.094 0.401917 372.086 0.401917H372.202ZM338.848 67.3551C348.748 67.3396 359.793 67.3551 372.202 67.3551C471.475 67.3551 483.241 67.7112 522.444 69.4913C558.695 71.1479 578.37 77.2004 591.476 82.2858C608.827 89.0198 621.197 97.0698 634.203 110.073C647.216 123.077 655.272 135.461 662.026 152.799C667.116 165.88 673.181 185.541 674.83 221.765C676.612 260.93 676.999 272.696 676.999 371.848C676.999 471 676.612 482.766 674.83 521.931C673.173 558.156 667.116 577.816 662.026 590.897C655.288 608.235 647.216 620.581 634.203 633.576C621.19 646.58 608.835 654.63 591.476 661.364C578.385 666.473 558.695 672.51 522.444 674.166C483.249 675.947 471.475 676.334 372.202 676.334C272.922 676.334 261.156 675.947 221.961 674.166C185.71 672.495 166.036 666.442 152.921 661.356C135.57 654.622 123.176 646.572 110.164 633.569C97.1503 620.565 89.0946 608.212 82.3398 590.866C77.2507 577.785 71.1857 558.125 69.5359 521.9C67.7543 482.735 67.3978 470.97 67.3978 371.755C67.3978 272.541 67.7543 260.837 69.5359 221.672C71.1936 185.448 77.2507 165.788 82.3398 152.691C89.0787 135.353 97.1503 122.969 110.164 109.965C123.176 96.9613 135.57 88.9117 152.921 82.1622C166.028 77.0534 185.71 71.0164 221.961 69.3518C256.26 67.8038 269.553 67.3396 338.848 67.2618L338.848 67.3551ZM570.67 129.045C546.038 129.045 526.053 148.991 526.053 173.613C526.053 198.227 546.038 218.197 570.67 218.197C595.302 218.197 615.287 198.227 615.287 173.613C615.287 148.999 595.302 129.029 570.67 129.029L570.67 129.045ZM372.202 181.136C266.756 181.136 181.264 266.565 181.264 371.933C181.264 477.301 266.756 562.691 372.202 562.691C477.649 562.691 563.11 477.301 563.11 371.933C563.11 266.565 477.641 181.136 372.195 181.136H372.202ZM372.202 248.09C440.646 248.09 496.138 303.533 496.138 371.933C496.138 440.326 440.646 495.777 372.202 495.777C303.751 495.777 248.267 440.326 248.267 371.933C248.267 303.533 303.751 248.09 372.202 248.09Z" fill="white"></path>
               </symbol>
               <symbol fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 40 40" id="facebook">
                  <path id="path" d="M27.8 25.6L28.7 20L23.4 20L23.4 16.1C23.4 14.5 24 13.3 26.4 13.3L29 13.3L29 8.2C27.6 8 26 7.8 24.6 7.8C20 7.8 16.79 10.6 16.79 15.6L16.79 20L11.8 20L11.8 25.6L16.79 25.6L16.79 39.7C17.9 39.9 19 40 20.1 40C21.2 40 22.3 39.9 23.4 39.7L23.4 25.6L27.8 25.6Z" fill="#FFFFFF" fill-opacity="1.000000" fill-rule="nonzero"></path>
               </symbol>
               <symbol fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" id="whatsapp">
                  <defs>
                     <clipPath id="clip2_11">
                        <rect id="svg" width="24.000000" height="24.000000" fill="white" fill-opacity="0"></rect>
                     </clipPath>
                  </defs>
                  <g clip-path="url(#clip2_11)">
                     <path id="path" d="M0.05 24L1.74 17.83C0.7 16.03 0.15 13.98 0.15 11.89C0.16 5.33 5.49 0 12.05 0C15.23 0 18.21 1.24 20.46 3.48C22.7 5.73 23.94 8.72 23.94 11.9C23.94 18.45 18.6 23.79 12.05 23.79C10.06 23.79 8.09 23.29 6.36 22.34L0.05 24ZM6.65 20.19C8.33 21.18 9.93 21.78 12.04 21.78C17.49 21.78 21.93 17.35 21.93 11.9C21.93 6.43 17.52 2.01 12.05 2C6.6 2 2.16 6.44 2.16 11.89C2.16 14.11 2.81 15.78 3.91 17.52L2.91 21.17L6.65 20.19ZM18.04 14.72C17.96 14.6 17.76 14.53 17.47 14.38C17.17 14.23 15.71 13.51 15.44 13.41C15.16 13.31 14.97 13.26 14.77 13.56C14.57 13.86 14 14.53 13.83 14.72C13.65 14.92 13.48 14.95 13.18 14.8C12.88 14.65 11.93 14.34 10.79 13.32C9.91 12.54 9.31 11.56 9.14 11.26C8.97 10.97 9.12 10.81 9.27 10.66C9.4 10.53 9.57 10.31 9.71 10.14C9.87 9.97 9.91 9.84 10.01 9.64C10.11 9.44 10.06 9.27 9.99 9.12C9.91 8.97 9.32 7.51 9.07 6.92C8.83 6.34 8.59 6.41 8.4 6.41L7.83 6.4C7.64 6.4 7.31 6.47 7.04 6.77C6.77 7.07 6 7.78 6 9.25C6 10.71 7.07 12.12 7.22 12.32C7.36 12.52 9.31 15.52 12.29 16.81C13 17.11 13.55 17.3 13.99 17.43C14.7 17.66 15.35 17.63 15.86 17.55C16.43 17.47 17.62 16.83 17.86 16.14C18.11 15.44 18.11 14.85 18.04 14.72Z" fill="#FFFFFF" fill-opacity="1.000000" fill-rule="nonzero"></path>
                  </g>
               </symbol>
               <symbol fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 70 70" id="vk">
                  <rect width="70.000000" height="70.000000"></rect>
                  <path id="path" d="M38.33 55.62C15.54 55.62 2.54 40 2 14L13.41 14C13.79 33.08 22.2 41.16 28.87 42.83L28.87 14L39.62 14L39.62 30.45C46.2 29.74 53.12 22.25 55.45 14L66.2 14C64.41 24.16 56.91 31.66 51.58 34.74C56.91 37.24 65.45 43.79 68.7 55.62L56.87 55.62C54.33 47.7 48 41.58 39.62 40.74L39.62 55.62L38.33 55.62Z" fill="#FFFFFF" fill-opacity="1.000000" fill-rule="nonzero"></path>
               </symbol>
               <symbol fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 26 26" id="messenger">
                  <rect width="26.000000" height="26.000000"></rect>
                  <g opacity="0.050000">
                     <path id="path" d="M23.99 5C23.56 5 23.14 5.14 22.79 5.41L17.09 9.62C16.96 9.72 16.81 9.77 16.66 9.77C16.51 9.77 16.37 9.72 16.25 9.64L12.27 6.65C11.47 6.04 10.51 5.73 9.52 5.73C7.94 5.73 6.49 6.52 5.64 7.84L4.43 9.73L0.31 16.43C-0.08 17.04 -0.11 17.8 0.24 18.44C0.6 19.1 1.27 19.5 2 19.5C2.43 19.5 2.85 19.36 3.2 19.09L8.9 14.88C9.03 14.78 9.18 14.73 9.33 14.73C9.48 14.73 9.62 14.77 9.74 14.86L13.71 17.85C14.52 18.45 15.47 18.77 16.47 18.77C18.05 18.77 19.5 17.98 20.35 16.66L21.56 14.76L25.68 8.07C26.07 7.46 26.1 6.7 25.75 6.06C25.39 5.4 24.72 5 23.99 5Z" fill="#000000" fill-opacity="1.000000" fill-rule="nonzero"></path>
                  </g>
                  <g opacity="0.070000">
                     <path id="path" d="M23.99 5.5C23.67 5.5 23.36 5.6 23.09 5.81L17.39 10.02C17.17 10.19 16.92 10.27 16.66 10.27C16.4 10.27 16.15 10.19 15.95 10.04L11.97 7.04C11.26 6.51 10.41 6.23 9.52 6.23C8.11 6.23 6.82 6.93 6.06 8.11L4.85 10.01L0.74 16.69C0.44 17.16 0.42 17.73 0.68 18.2C0.95 18.69 1.47 19 2 19C2.32 19 2.63 18.9 2.9 18.69L8.6 14.48C8.82 14.31 9.07 14.23 9.33 14.23C9.59 14.23 9.84 14.31 10.04 14.46L14.02 17.45C14.73 17.99 15.58 18.27 16.47 18.27C17.88 18.27 19.17 17.57 19.93 16.39L21.14 14.49L25.25 7.81C25.55 7.34 25.57 6.77 25.31 6.3C25.04 5.81 24.52 5.5 23.99 5.5Z" fill="#000000" fill-opacity="1.000000" fill-rule="nonzero"></path>
                  </g>
                  <path id="path" d="M23.39 6.2L17.69 10.42C17.08 10.88 16.25 10.88 15.65 10.43L11.67 7.44C9.99 6.19 7.61 6.62 6.48 8.38L5.27 10.27L1.16 16.95C0.56 17.89 1.71 18.96 2.6 18.29L8.3 14.07C8.91 13.61 9.74 13.61 10.34 14.06L14.32 17.05C16 18.3 18.38 17.87 19.51 16.11L20.72 14.22L24.83 7.54C25.43 6.6 24.28 5.53 23.39 6.2Z" fill="#FFFFFF" fill-opacity="1.000000" fill-rule="nonzero"></path>
               </symbol>
               <symbol fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 50 50" id="telegram">
                  <rect width="50.000000" height="50.000000"></rect>
                  <path id="path" d="M13.33 27.83L18.43 41.95C18.43 41.95 19.07 43.28 19.75 43.28C20.43 43.28 30.59 32.71 30.59 32.71L41.89 10.89L13.51 24.19L13.33 27.83Z" fill="#C8DAEA" fill-opacity="1.000000" fill-rule="nonzero"></path>
                  <path id="path" d="M20.09 31.45L19.11 41.86C19.11 41.86 18.7 45.05 21.89 41.86C25.08 38.67 28.13 36.21 28.13 36.21L20.09 31.45Z" fill="#A9C6D8" fill-opacity="1.000000" fill-rule="nonzero"></path>
                  <path id="path" d="M13.42 28.34L2.93 24.92C2.93 24.92 1.67 24.41 2.08 23.26C2.16 23.02 2.33 22.82 2.83 22.47C5.15 20.85 45.87 6.21 45.87 6.21C45.87 6.21 47.02 5.83 47.69 6.08C48.06 6.2 48.29 6.44 48.37 6.82C48.44 7.12 48.47 7.43 48.46 7.75C48.46 8.02 48.42 8.27 48.4 8.66C48.15 12.66 40.73 42.52 40.73 42.52C40.73 42.52 40.29 44.26 38.7 44.32C37.87 44.35 37.16 44.08 36.57 43.5C33.45 40.82 22.66 33.57 20.28 31.97C20.16 31.89 20.1 31.79 20.08 31.65C20.05 31.48 20.23 31.27 20.23 31.27C20.23 31.27 39.02 14.58 39.52 12.82C39.56 12.69 39.41 12.62 39.21 12.68C37.97 13.14 16.34 26.8 13.95 28.31C13.78 28.36 13.6 28.37 13.42 28.34Z" fill="#FFFFFF" fill-opacity="1.000000" fill-rule="nonzero"></path>
               </symbol>
                <symbol fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 50 50" id="x">
                  <defs>
                    <clipPath id="clip10_2">
                      <rect id="logo" width="50.000000" height="50.000000" fill-opacity="0"></rect>
                    </clipPath>
                  </defs>
                  <g clip-path="url(#clip10_2)">
                    <path id="path" d="M29.75 21.16L48.37 0L43.95 0L27.79 18.37L14.88 0L0 0L19.52 27.78L0 49.97L4.41 49.97L21.47 30.57L35.11 49.97L50 49.97L29.75 21.16ZM23.71 28.02L21.73 25.26L6 3.24L12.77 3.24L25.47 21.01L27.45 23.78L43.96 46.87L37.18 46.87L23.71 28.02Z" fill="#FFFFFF" fill-opacity="1.000000" fill-rule="nonzero"></path>
                  </g>
                </symbol>
                <symbol fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 75.7673 76.248" id="linkedin">
                  <path id="path14" d="M0 5.46C0 2.44 2.5 0 5.59 0L70.16 0C73.26 0 75.76 2.44 75.76 5.46L75.76 70.78C75.76 73.8 73.26 76.24 70.16 76.24L5.59 76.24C2.5 76.24 0 73.8 0 70.78L0 5.46Z" fill="#006699" fill-opacity="0" fill-rule="nonzero"></path>
                  <path id="path14" d="M5.59 0L70.16 0C73.26 0 75.76 2.44 75.76 5.46L75.76 70.78C75.76 73.8 73.26 76.24 70.16 76.24L5.59 76.24C2.5 76.24 0 73.8 0 70.78L0 5.46C0 2.44 2.5 0 5.59 0Z" stroke="#000000" stroke-opacity="0" stroke-width="1.018827"></path>
                  <path id="path28" d="M22.96 63.82L22.96 29.39L11.52 29.39L11.52 63.82L22.96 63.82ZM17.24 24.69C21.23 24.69 23.72 22.05 23.72 18.74C23.64 15.36 21.23 12.79 17.32 12.79C13.4 12.79 10.84 15.36 10.84 18.74C10.84 22.05 13.4 24.69 17.24 24.69Z" fill="#FFFFFF" fill-opacity="1.000000" fill-rule="evenodd"></path>
                  <path id="path28" d="M22.96 29.39L11.52 29.39L11.52 63.82L22.96 63.82L22.96 29.39ZM23.72 18.74C23.64 15.36 21.23 12.79 17.32 12.79C13.4 12.79 10.84 15.36 10.84 18.74C10.84 22.05 13.4 24.69 17.24 24.69C21.23 24.69 23.72 22.05 23.72 18.74Z" stroke="#000000" stroke-opacity="0" stroke-width="1.018827"></path>
                  <path id="path30" d="M29.29 63.82L40.74 63.82L40.74 44.6C40.74 43.57 40.81 42.54 41.12 41.8C41.94 39.75 43.83 37.62 46.99 37.62C51.13 37.62 52.78 40.77 52.78 45.4L52.78 63.82L64.23 63.82L64.23 44.08C64.23 33.51 58.58 28.58 51.05 28.58C44.88 28.58 42.17 32.04 40.66 34.39L40.74 29.39L29.3 29.39C29.45 32.62 29.29 63.82 29.29 63.82Z" fill="#FFFFFF" fill-opacity="1.000000" fill-rule="evenodd"></path>
                  <path id="path30" d="M40.74 63.82L40.74 44.6C40.74 43.57 40.81 42.54 41.12 41.8C41.94 39.75 43.83 37.62 46.99 37.62C51.13 37.62 52.78 40.77 52.78 45.4L52.78 63.82L64.23 63.82L64.23 44.08C64.23 33.51 58.58 28.58 51.05 28.58C44.88 28.58 42.17 32.04 40.66 34.39L40.74 29.39L29.3 29.39C29.45 32.62 29.29 63.82 29.29 63.82L40.74 63.82Z" stroke="#000000" stroke-opacity="0" stroke-width="1.018827"></path>
                </symbol>
            </svg>
         </div>
         <style>
            @keyframes pulse-custom {
              0% {
                  box-shadow: 0 8px 10px rgba(${brandColor}, 0.3), 0 0 0 0 rgba(${brandColor}, 0.2), 0 0 0 0 rgba(${brandColor}, 0.2)
              }
              40% {
                  box-shadow: 0 8px 10px rgba(${brandColor}, 0.3), 0 0 0 15px rgba(${brandColor}, 0.2), 0 0 0 0 rgba(${brandColor}, 0.2)
              }
              80% {
                  box-shadow: 0 8px 10px rgba(${brandColor}, 0.3), 0 0 0 30px rgba(${brandColor}, 0), 0 0 0 27px rgba(${brandColor}, 0.067)
              }
              100% {
                  box-shadow: 0 8px 10px rgba(${brandColor}, 0.3), 0 0 0 30px rgba(${brandColor}, 0), 0 0 0 40px rgba(${brandColor}, 0.0)
              }
            }
         </style>
         <a href="${link}" class="iec__link" target="_blank">
            <div class="iec__cta" style="background-color: ${backgroundColor}">
               <div class="iec__cta-text">
               ${textCTA}
               <span>${textOffer}</span>
              </div>
            </div>
            <div class="iec__icon" style="background: ${background}; 
               ${isAnimationDisabled ? 'animation: none;' : 'animation-name: pulse-custom;'}">
               <svg width="50" height="50">
                  <use xlink:href="${icon}"></use>
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

  #getSocialData () {
    // brandColor rgb without (). Example 0, 98, 224
    return {
      'instagram': {
        'link': 'https://www.instagram.com/',
        'backgroundIconColor': 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
        'socialName': 'Instagram',
        'icon': '#instagram',
        'brandColor': '188, 24, 136',
      },
      'facebook': {
        'link': 'https://www.facebook.com/',
        'backgroundIconColor': 'linear-gradient(0.00deg, rgb(0, 98, 224) 2.994%,rgb(25, 175, 255) 100.02%);',
        'socialName': 'Facebook',
        'icon': '#facebook',
        'brandColor': '0, 98, 224',
      },

      'whatsapp': {
        'link': 'https://wa.me/',
        'backgroundIconColor': 'linear-gradient(0.00deg, rgb(16, 171, 43) 32.62%,rgb(96, 245, 120) 100.02%);',
        'socialName': 'WhatsApp',
        'icon': '#whatsapp',
        'brandColor': '16, 171, 43',
      },
      'vk': {
        'link': 'https://vk.me/',
        'backgroundIconColor': '#0077FF',
        'socialName': 'VK',
        'icon': '#vk',
        'brandColor': '0, 119, 255',
      },
      'messenger': {
        'link': 'https://m.me/',
        'backgroundIconColor': 'radial-gradient(116.00% 119.00% at 18% 95%,rgb(18, 146, 255),rgb(41, 130, 255) 7.9%,rgb(78, 105, 255) 23%,rgb(101, 89, 255) 35.1%,rgb(109, 83, 255) 42.8%,rgb(223, 71, 170) 75.4%,rgb(255, 98, 87) 94.6%)',
        'socialName': 'Messenger',
        'icon': '#messenger',
        'brandColor': '223, 71, 170',
      },
      'telegram': {
        'link': 'https://x.com/',
        'backgroundIconColor': 'linear-gradient(0.00deg, rgb(29, 147, 210),rgb(56, 176, 227) 100%)',
        'socialName': 'Telegram',
        'icon': '#telegram',
        'brandColor': '29, 147, 210',
      },
      'x': {
        'link': 'https://t.me/',
        'backgroundIconColor': '#000',
        'socialName': 'X',
        'icon': '#x',
        'brandColor': '0, 0, 0',
      },
      'linkedin': {
        'link': 'https://t.me/',
        'backgroundIconColor': 'rgb(10, 102, 194)',
        'socialName': 'LinkedIn',
        'icon': '#linkedin',
        'brandColor': '10, 102, 194',
      },
    };
  }
}

// Регистрация пользовательского элемента
customElements.define('net-easy-widget', NetEasyWidget);

// Использование элемента с передачей свойства
const widget = document.createElement('net-easy-widget');
document.body.appendChild(widget);
