package cn.funstack.foldericon.generator.util;

import javax.imageio.ImageIO;
import javax.swing.*;
import java.awt.*;
import java.awt.image.BufferedImage;

import cn.funstack.foldericon.generator.exception.ApiError;
import cn.funstack.foldericon.generator.exception.ApiException;
import lombok.extern.slf4j.Slf4j;
import org.apache.batik.transcoder.Transcoder;
import org.apache.batik.transcoder.TranscoderException;
import org.apache.batik.transcoder.TranscoderInput;
import org.apache.batik.transcoder.TranscoderOutput;
import org.apache.batik.transcoder.image.PNGTranscoder;
import org.apache.commons.imaging.ImageFormats;
import org.apache.commons.imaging.Imaging;

import java.io.*;

/**
 * @FileName ImageCombiner
 * @Description
 * @Author yifan
 * @date 2025-02-05 18:01
 **/

@Slf4j
public class ImageUtil {

    private static BufferedImage transcodeSVGToBufferedImage(String svgFilePath, int width, int height) {
        // Create a PNG transcoder.
        Transcoder t = new PNGTranscoder();

        // Set the transcoding hints.
        t.addTranscodingHint(PNGTranscoder.KEY_WIDTH, (float) width);
        t.addTranscodingHint(PNGTranscoder.KEY_HEIGHT, (float) height);

        File svgFile = new File(svgFilePath);
        try (FileInputStream inputStream = new FileInputStream(svgFile)) {
            // Create the transcoder input.
            TranscoderInput input = new TranscoderInput(inputStream);

            // Create the transcoder output.
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            TranscoderOutput output = new TranscoderOutput(outputStream);

            // Save the image.
            t.transcode(input, output);

            // Flush and close the stream.
            outputStream.flush();
            outputStream.close();

            // Convert the byte stream into an image.
            byte[] imgData = outputStream.toByteArray();
            return ImageIO.read(new ByteArrayInputStream(imgData));

        } catch (IOException | TranscoderException e) {
            log.error("Conversion error", e);
            throw new ApiException(ApiError.SVG_READ_ERROR);
        }
    }

    public static void composeImages(
            String baseFilePath, String svgFilePath, Integer svgWidth, Integer svgHeight,
            Integer svgX, Integer svgY, String text, Integer textSize, Integer textX, Integer textY, String outputFilePath
    ) throws IOException, TranscoderException {
        // 读取PNG背景图片
        BufferedImage backgroundImage = Imaging.getBufferedImage(new File(baseFilePath));
        // 读取svg图片
        BufferedImage resizedSvgImage = transcodeSVGToBufferedImage(svgFilePath, svgWidth, svgHeight);

        // 创建一个新的图像，用于合成
        Graphics2D g2d = backgroundImage.createGraphics();
        g2d.drawImage(resizedSvgImage, svgX, svgY, null); // 将调整大小后的SVG图像绘制到指定位置

        // 设置字体和字体大小
        if (text != null) {
            Font font = new Font("微软黑体", Font.BOLD, textSize);
            g2d.setFont(font);
            g2d.setColor(Color.BLACK);
            g2d.drawString(text, textX, textY);
        }

        // 释放资源
        g2d.dispose();

        // 保存合成后的图像
        File outputFile = new File(outputFilePath);
        //ImageIO.write(backgroundImage, "ico", outputFile);
        Imaging.writeImage(backgroundImage, outputFile, ImageFormats.ICO);
    }

    public static BufferedImage iconToBufferedImage(Icon icon) {
        BufferedImage image = new BufferedImage(icon.getIconWidth(), icon.getIconHeight(), BufferedImage.TYPE_INT_ARGB);
        Graphics g = image.createGraphics();
        icon.paintIcon(null, g, 0, 0);
        g.dispose();
        return image;
    }

}
