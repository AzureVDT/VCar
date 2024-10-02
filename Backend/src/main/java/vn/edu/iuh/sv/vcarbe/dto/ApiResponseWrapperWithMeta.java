package vn.edu.iuh.sv.vcarbe.dto;

public record ApiResponseWrapperWithMeta(int code, String message, Object data, PaginationMetadata meta) {
}
