import React, {useContext} from 'react';
import {RtcLocalView, RtcRemoteView, VideoRenderMode} from 'react-native-agora';
import styles from '../Style';
import PropsContext, {ContentInterface} from '../Contexts/PropsContext';
import {
  View,
  ViewStyle,
  useWindowDimensions,
  Platform,
  ViewProps,
} from 'react-native';
import useLocalUid from '../Utils/useLocalUid';

const LocalView = RtcLocalView.SurfaceView;
let RemoteView = RtcRemoteView.SurfaceView;

interface MaxViewInterface {
  user: ContentInterface;
  fallback?: React.ComponentType;
  containerStyle?: ViewStyle;
  landscapeMode?: boolean;
  isFullView?: boolean;
}

const MaxVideoView: React.FC<MaxViewInterface> = (props) => {
  const {styleProps, rtcProps} = useContext(PropsContext);
  const {maxViewStyles} = styleProps || {};
  const {
    containerStyle = {},
    landscapeMode = false,
    isFullView = false,
  } = props;
  let landscapeModeStyle: ViewProps['style'] = {};
  if (landscapeMode) {
    //SurfaceView does not support transform
    //TextureView only applicable to android
    if (Platform.OS === 'android') {
      RemoteView = RtcRemoteView.TextureView;
    }
    landscapeModeStyle = {
      flex: 1,
      alignSelf: 'center',
      alignItems: 'center',
      transform: [{rotate: '90deg'}],
    };
  }
  const Fallback = props.fallback;
  const localUid = useLocalUid();
  //@ts-ignore
  const uid = props.user.uid === rtcProps?.screenShareUid ? 1 : props.user.uid;
  return uid === localUid ? (
    props.user.video ? (
      <LocalView
        style={{
          ...styles.fullView,
          ...(maxViewStyles as object),
          ...containerStyle,
        }}
        renderMode={isFullView ? VideoRenderMode.FILL : VideoRenderMode.Fit}
      />
    ) : Fallback ? (
      <Fallback />
    ) : (
      <View style={[{flex: 1, backgroundColor: '#000'}, containerStyle]} />
    )
  ) : props.user.video ? (
    <RemoteView
      style={{
        ...styles.fullView,
        ...(maxViewStyles as object),
        ...containerStyle,
        ...landscapeModeStyle,
      }}
      uid={uid as number}
      renderMode={VideoRenderMode.Fit}
    />
  ) : Fallback ? (
    <Fallback />
  ) : (
    <View style={[{flex: 1, backgroundColor: '#000'}, containerStyle]} />
  );
};

export default MaxVideoView;
