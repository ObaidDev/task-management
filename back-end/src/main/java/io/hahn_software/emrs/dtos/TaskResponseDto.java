package io.hahn_software.emrs.dtos;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

import io.hahn_software.emrs.enums.TaskPriority;
import io.hahn_software.emrs.enums.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskResponseDto {

    private Long id;

    private String name;

    private TaskStatus status;

    private TaskPriority priority;

    private String description;

    private Long estimateDate;

    private UUID assignToUserId;

    private String userName;

    private Long createdAt;

    private Long updatedAt;
}
