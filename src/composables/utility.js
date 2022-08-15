import { copyToClipboard } from "quasar";
// import { useStore } from "src/stores/store";
import { date } from "quasar";
import useApp from "./app";
// destructuring to keep only what is needed
const { formatDate } = date;

export default function useUtility() {
  // const store = useStore();
  // import store from "src/store";
  const { infoNotify } = useApp();
  const readPicture = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = ({ target }) => {
        target = target;
        resolve(target.result);
      };
      reader.onerror = (e) => {
        reject(e);
      };
    });
  };

  const buildForm = (data) => {
    const keys = Object.keys(data);
    const formData = new FormData();
    console.log(data);
    keys.forEach((key) => {
      if (data[key] != undefined && !Array.isArray(data[key]))
        formData.append(key, data[key]);
      else if (Array.isArray(data[key])) {
        data[key].forEach((e, index) => {
          formData.append(`${key}[${index}]`, e);
        });
      }
    });
    return formData;
  };

  const pageOptions = (offset, height) => ({
    height: height - offset + "px",
    // background: "red",
  });

  const twoDigitsStringValue = (number) => {
    if (isNaN(number * 0)) return number;
    const casted = String(number);
    if (casted.length == 1) return "0" + casted;
    else return casted;
  };

  const parseDate = (date) => {
    return formatDate(new Date(date), "DD-MM-YYYY hh:mm:ss A");
  };

  const setValue = (number) => {
    if (isNaN(number * 0)) return number;
    return Number(number).toFixed(2);
  };

  // export const filterSelect = (val, categories) => {
  //   const needle = val.toLowerCase();
  //   categories.value = store.state.categories.filter(
  //     (v) => v.name.toLowerCase().indexOf(needle) > -1
  //   );
  // };

  const formatCurrency = (number) => {
    return new Intl.NumberFormat("en-US", {
      // style: "currency",
      // currency: "MMK",

      // These options are needed to round to whole numbers if that's what you want.
      minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
      //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    }).format(number);
  };

  const getQR = (url) => {
    return (
      "https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=" + url
    );
  };
  const copyLinkToClipboard = (content) => {
    copyToClipboard(content).then((_) => {
      infoNotify(`"${content}" has been copied`);
    });
  };

  const downloadImage = async (url, name) => {
    const image = await fetch(url);
    const imageBlog = await image.blob();
    const imageURL = URL.createObjectURL(imageBlog);

    const link = document.createElement("a");
    link.href = imageURL;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // const initFB = () => {
  //   return new Promise((resolve) => {
  //     window.fbAsyncInit = function () {
  //       FB.init({
  //         appId: store.getAppSetting.fb_app_id,
  //         cookie: true,
  //         xfbml: true,
  //         version: "v14.0",
  //       });

  //       FB.AppEvents.logPageView();
  //       resolve(FB);
  //     };

  //     (function (d, s, id) {
  //       var js,
  //         fjs = d.getElementsByTagName(s)[0];
  //       if (d.getElementById(id)) {
  //         return;
  //       }
  //       js = d.createElement(s);
  //       js.id = id;
  //       js.src = "https://connect.facebook.net/en_US/sdk.js";
  //       fjs.parentNode.insertBefore(js, fjs);
  //     })(document, "script", "facebook-jssdk");
  //   });
  // };

  return {
    readPicture,
    buildForm,
    pageOptions,
    twoDigitsStringValue,
    formatCurrency,
    getQR,
    downloadImage,
    copyLinkToClipboard,
    setValue,
    parseDate,
    // initFB,
  };
}
