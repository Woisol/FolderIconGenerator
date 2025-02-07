package cn.funstack.foldericon.generator.pojo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;

/**
 * @FileName SetIconDTO
 * @Description
 * @Author yifan
 * @date 2025-02-06 21:36
 **/

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SetIconDTO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private String path;

    private String icoFileName;

}
