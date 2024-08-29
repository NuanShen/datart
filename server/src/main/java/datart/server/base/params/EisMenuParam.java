package datart.server.base.params;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import java.util.List;

@Data
public class EisMenuParam {
    @NotBlank(message = "Username can not be empty")
    private String menuName;

    @NotBlank(message = "superCode can not be empty")
    private String superCode;

    private String url;

    private String menuType;

    private String menuTarget;

    private String appId;

    private String isLeaf;

    private String levelId;

    private String menuPageFlag;

    private String datasource;

    private String operatorUser;

    private List<Integer> roleIds;
}
