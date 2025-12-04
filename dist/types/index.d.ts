declare module '@mopinion/react-native-sdk' {

  interface MetaData {
    [key: string]: string;
  }

  interface FeedbackData {
    [label: string]: string;
    [type: string]: string;
    [value: string]: string;
  }

  interface MopinionDeploymentProps {
    deploymentID: string;
    metaData?: MetaData;
    fireWhenReady?: string[];
    modalAnimationDuration?: number;

    onOpen?: (data: { formKey: string }) => void;
    onFormLoaded?: (data: { formKey: string; formName: string }) => void;
    onClose?: (data: { formKey: string; formName: string }) => void;
    onFeedbackSent?: (data: {
      formKey: string;
      formName: string;
      feedback: FeedbackData[];
    }) => void;
    colorScheme?: 'light' | 'dark' | 'system' | null;
  }

  class MopinionDeployment extends React.Component<MopinionDeploymentProps> {}

  const MopinionSDK: {
    event: (event: string) => void;
  };
  
  export {
    MopinionDeployment, MopinionSDK
  }
}