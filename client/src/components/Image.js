import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'

const Image = ({image, removeImage, onError}) => {
  return (
    <div className='fadein'>
      <div
        onClick={() => removeImage(image)}
        className='delete'
      >
        <FontAwesomeIcon icon={faTimesCircle} size='2x' />
      </div>
      <img
        className='recipeImg'
        src={image.url}
        alt={image.fileName}
        onError={() => onError(image)}
      />
    </div>
  );
};

export default Image;
