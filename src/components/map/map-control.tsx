import React from 'react';
import {
  ScaleControl,
  GeolocateControl,
  NavigationControl,
  FullscreenControl,
} from 'react-map-gl';

import { StyledMapControls } from './styles';

// ----------------------------------------------------------------------

type Props = {
  hideScaleControl?: boolean;
  hideGeolocateControl?: boolean;
  hideFullscreenControl?: boolean;
  hideNavigationnControl?: boolean;
};

export default function MapControl({
  hideScaleControl,
  hideGeolocateControl,
  hideFullscreenControl,
  hideNavigationnControl,
}: Props) {
  return (
    <>
      <StyledMapControls />

      {!hideGeolocateControl && (
        <GeolocateControl
          position="top-left"
          positionOptions={{ enableHighAccuracy: true }}
        />
      )}

      {!hideFullscreenControl && <FullscreenControl position="top-left" />}

      {!hideScaleControl && <ScaleControl position="bottom-left" />}

      {!hideNavigationnControl && <NavigationControl position="bottom-left" />}
    </>
  );
}
