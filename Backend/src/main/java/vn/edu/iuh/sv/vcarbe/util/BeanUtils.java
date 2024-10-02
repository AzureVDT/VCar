package vn.edu.iuh.sv.vcarbe.util;

import java.lang.reflect.Field;

public class BeanUtils {
    public static void copyNonNullProperties(Object source, Object target) {
        Field[] fields = source.getClass().getDeclaredFields();

        for (Field field : fields) {
            field.setAccessible(true);
            try {
                Object value = field.get(source);
                if (value != null) {
                    field.set(target, value);
                }
            } catch (IllegalAccessException e) {
                throw new RuntimeException("Failed to copy properties", e);
            }
        }
    }
}
