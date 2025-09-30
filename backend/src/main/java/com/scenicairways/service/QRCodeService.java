package com.scenicairways.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.FileSystems;
import java.nio.file.Path;

@Service
public class QRCodeService {

    private static final String QR_CODE_IMAGE_PATH = "./qr-codes/";

    public String generateQRCode(String text, String fileName) {
        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, 350, 350);

            Path path = FileSystems.getDefault().getPath(QR_CODE_IMAGE_PATH + fileName + ".png");
            MatrixToImageWriter.writeToPath(bitMatrix, "PNG", path);

            return path.toString();
        } catch (WriterException | IOException e) {
            System.err.println("Could not generate QR Code: " + e.getMessage());
            return null;
        }
    }

    public byte[] generateQRCodeBytes(String text) {
        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, 350, 350);
            
            return MatrixToImageWriter.toByteArray(bitMatrix, "PNG");
        } catch (WriterException | IOException e) {
            System.err.println("Could not generate QR Code bytes: " + e.getMessage());
            return null;
        }
    }
}