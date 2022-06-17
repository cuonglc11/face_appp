import ImagePicker from 'react-native-images-crop-picker';

export function pickImageFromCamera(onSuccess, onFailure) {
  ImagePicker.openCamera({
    width: 300,
    height: 400,
    cropping: true,
  })
    .then(image => {
      onSuccess(image);
    })
    .catch(err => {
      onFailure(err);
    });
}

export function pickImageFromGallery(onSuccess, onFailure) {
  ImagePicker.openPicker({
    multiple: true,
    mediaType: 'photo',
  })
    .then(images => {
      onSuccess(images);
    })
    .catch(err => {
      onFailure(err);
    });
}

export function pickSingleImageFromGallery(onSuccess, onFailure) {
  ImagePicker.openPicker({
    multiple: false,
  })
    .then(image => {
      onSuccess(image);
    })
    .catch(err => {
      onFailure(err);
    });
}
