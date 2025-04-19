"use client";
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect } from 'react';
import '../styles/qrcode-scanner.css';

const qrcodeRegionId = "html5qr-code-full-region";

interface Html5QrcodePluginProps {
    fps?: number;
    qrbox?: number | { width: number; height: number };
    aspectRatio?: number;
    disableFlip?: boolean;
    verbose?: boolean;
    qrCodeSuccessCallback: (decodedText: string, decodedResult: any) => void;
    qrCodeErrorCallback?: (errorMessage: string, error: any) => void;
}

// Creates the configuration object for Html5QrcodeScanner.
const createConfig = (props: Html5QrcodePluginProps): {
    fps?: number;
    qrbox?: number | { width: number; height: number };
    aspectRatio?: number;
    disableFlip?: boolean;
} => {
    let config = {};
    if (props.fps) {
        config = { ...config, fps: props.fps };
    }
    if (props.qrbox) {
        config = { ...config, qrbox: props.qrbox };
    }
    if (props.aspectRatio) {
        config = { ...config, aspectRatio: props.aspectRatio };
    }
    if (props.disableFlip !== undefined) {
        config = { ...config, disableFlip: props.disableFlip };
    }
    return config;
};

const Html5QrcodePlugin: React.FC<Html5QrcodePluginProps> = (props) => {
    useEffect(() => {
        // when component mounts
        const config = createConfig(props);
        const verbose = props.verbose === true;
        // Success callback is required.
        if (!(props.qrCodeSuccessCallback)) {
            throw new Error("qrCodeSuccessCallback is required callback.");
        }
        const html5QrcodeScanner = new Html5QrcodeScanner(qrcodeRegionId, config, verbose);
        html5QrcodeScanner.render(props.qrCodeSuccessCallback, props.qrCodeErrorCallback);

        // cleanup function when component will unmount
        return () => {
            html5QrcodeScanner.clear().catch(error => {
                console.error("Failed to clear html5QrcodeScanner. ", error);
            });
        };
    }, []);

    return (
        <>
            <style jsx>{`
                #html5-qrcode-button-camera-permission {
                    @apply bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2;
                }
            `}</style>
            <div id={qrcodeRegionId} className="w-full max-w-lg mx-auto p-4" />
        </>
    );
};

export default Html5QrcodePlugin; 