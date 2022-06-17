import moment from 'moment';
import {Alert} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import alerts from '../constants/alerts';

function formatNumber(number) {
  if (!number) {
    return 0;
  }
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function formatDate(date) {
  return moment(date).utc().format('DD/MM/YYYY');
}

function formatDateSearch(date) {
  return moment(date).format('YYYY-MM-DD');
}

function formatDateShow(date) {
  return moment(date).format('YYYY/MM/DD') + ' 00:00';
}

function getDateNow() {
  return moment().format('YYYY/MM/DD') + ' 23:59';
}

function splitDate(date) {
  if (!date) {
    console.log(11);
    return '';
  }
  return date.split(' ');
}

function formatDateTime(date, isRevert = false) {
  return moment(date)
    .utc()
    .format(isRevert ? 'DD/MM/YYYY - HH:mm' : 'HH:mm DD/MM/YYYY');
}

function searchSelectOption(label, arrayObject, key = 'label') {
  const result = [];

  for (let i = 0; i < arrayObject.length; i++) {
    if (
      (arrayObject[i][key].indexOf('Tất cả') === -1 || !label) &&
      arrayObject[i][key].toLowerCase().search(label.toLowerCase()) >= 0
    ) {
      result.push(arrayObject[i]);
    }
  }

  return result;
}

function showAlertCaution(message, onCancel, onConfirm) {
  Alert.alert('Thông báo', message, [
    {
      text: 'Huỷ',
      style: 'cancel',
      onPress: () => {
        if (onCancel) {
          onCancel();
        }
      },
    },
    {
      text: 'Đồng ý',
      onPress: () => {
        onConfirm();
      },
    },
  ]);
}

function showAlertOneChoice(message, labelButton, onConfirm) {
  Alert.alert(alerts.title, message, [
    {
      text: labelButton,
      onPress: () => {
        if (onConfirm) {
          onConfirm();
        }
      },
    },
  ]);
}

function getFileName(file) {
  if (file.name !== undefined) {
    return file.name;
  } else if (file.filename !== undefined && file.filename !== null) {
    return file.filename;
  } else {
    const type = file?.mime || file?.type;
    return (
      Math.floor(Math.random() * Math.floor(999999999)) +
      '.' +
      type.split('/')[1]
    );
  }
}

function pickImageFromCamera(onSuccess, onFailure) {
  ImagePicker.openCamera({
    width: 900,
    height: 1200,
    useFrontCamera: true,
  })
    .then(image => {
      console.log(image, 'image');
      onSuccess(image);
    })
    .catch(err => {
      if (err.code !== 'E_PICKER_CANCELLED') {
        console.log(err);
      }
      onFailure();
    });
}

const common = {
  formatNumber,
  formatDate,
  searchSelectOption,
  formatDateTime,
  showAlertCaution,
  showAlertOneChoice,
  getFileName,
  getDateNow,
  splitDate,
  formatDateSearch,
  formatDateShow,
  pickImageFromCamera,
};

export default common;
