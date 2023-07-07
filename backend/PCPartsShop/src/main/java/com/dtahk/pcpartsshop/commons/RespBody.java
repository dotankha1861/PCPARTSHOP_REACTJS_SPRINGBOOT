package com.dtahk.pcpartsshop.commons;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RespBody {
    private int status;
    private String message;
    private Object data;
}
