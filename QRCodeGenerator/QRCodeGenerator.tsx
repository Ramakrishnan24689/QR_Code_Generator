import * as React from 'react';
import { QRCanvas } from 'qrcanvas-react';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { useConstCallback } from '@uifabric/react-hooks';

export interface IQRCodeGenrops {
  // These are set based on the toggles shown above the examples (not needed in real code)
  buttonValue: string;
  buttonLink: string;
}

const buttonStyles = { root: { marginRight: 8 } };
let canvasComponent: QRCanvas;
export const ButtonAnchor: React.FunctionComponent<IQRCodeGenrops> = props => {
  const [isOpen, setIsOpen] = React.useState(false);

  const openPanel = useConstCallback(() => setIsOpen(true));
  const dismissPanel = useConstCallback(() => setIsOpen(false));
  const options = { cellSize: 8, data: props.buttonLink };
  // This panel doesn't actually save anything; the buttons are just an example of what
  // someone might want to render in a panel footer.
  
  const onRenderFooterContent = useConstCallback(() => (
    <div>
      <PrimaryButton styles={buttonStyles}
        onClick={(event: React.MouseEvent<HTMLButtonElement>) => downLoadQRCode(event)}>
        Download
      </PrimaryButton>
      <DefaultButton onClick={dismissPanel}>Cancel</DefaultButton>
    </div>

  ));
  return (
    <div>
      <PrimaryButton text={props.buttonValue} onClick={openPanel} />
      <Panel
        isOpen={isOpen}
        onDismiss={dismissPanel}
        type={PanelType.medium}
        headerText="QR Code Generated"
        closeButtonAriaLabel="Close"
        onRenderFooterContent={onRenderFooterContent}
        isFooterAtBottom={true}
      >
        <span><br /><QRCanvas ref={(elm: QRCanvas) => { canvasComponent = elm }} options={options} /></span>
      </Panel>
    </div>
  );
};

function downLoadQRCode(_event: React.MouseEvent<HTMLButtonElement>) {
  // Generate a data URI for a PNG equivalent of the SVG
  const dataUri = _getImageUri();
  // Change the download link to point to the new data URI
  let qrLink: HTMLAnchorElement = document.createElement('a');
  qrLink.href = dataUri;
  let att = document.createAttribute("download");       // Create a "class" attribute
  qrLink.setAttributeNode(att);
  // Trigger a download
  qrLink.click();
}

function _getImageUri(): string {
  // Get the canvas where the QR code was produced
  const canvas: HTMLCanvasElement = canvasComponent["canvas"];

  // Generate a data URI for a PNG equivalent of the SVG
  const dataUri = canvas.toDataURL("image/png");
  return dataUri;
}