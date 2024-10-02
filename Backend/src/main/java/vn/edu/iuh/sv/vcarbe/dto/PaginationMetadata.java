package vn.edu.iuh.sv.vcarbe.dto;

public record PaginationMetadata(
    int page, 
    int pageSize, 
    long itemCount, 
    int pageCount, 
    boolean hasPreviousPage, 
    boolean hasNextPage) {
}