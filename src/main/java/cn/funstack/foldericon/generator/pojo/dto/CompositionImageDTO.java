package cn.funstack.foldericon.generator.pojo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;

/**
 * @FileName CompositionImageDTO
 * @Description
 * @Author yifan
 * @date 2025-02-06 15:17
 **/

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CompositionImageDTO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private String icoFileName;

    private String svgFileName;

    private Integer svgSize;

    private Integer svgX;

    private Integer svgY;

    private String text;

    private Integer textSize;

    private Integer textX;

    private Integer textY;

    private String outputFileName;

}
