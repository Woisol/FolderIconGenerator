package cn.funstack.foldericon.generator.pojo.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;
import java.util.List;

/**
 * @FileName ImageConfigVO
 * @Description
 * @Author yifan
 * @date 2025-02-06 15:06
 **/

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ImageConfigVO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private List<String> icoFileNames;

    private List<String> svgFileNames;

}
