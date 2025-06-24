package io.hahn_software.emrs.dtos;

import java.time.LocalDate;
import java.util.UUID;

import io.hahn_software.emrs.dtos.interfaces.CreateValidationGroup;
import io.hahn_software.emrs.dtos.interfaces.UpdateValidationGroup;
import io.hahn_software.emrs.enums.TaskPriority;
import io.hahn_software.emrs.enums.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskRequestDto {


    @NotBlank(message = "Name is required" , groups = {CreateValidationGroup.class})
    private String name;

    @NotNull(message = "Status is required" , groups = {CreateValidationGroup.class})
    private TaskStatus status;

    @NotNull(message = "Priority is required" , groups = {CreateValidationGroup.class})
    private TaskPriority priority;

    private String description;

    @NotNull(message = "estimateDate is required" , groups = {CreateValidationGroup.class})
    private Long estimateDate;

    @NotNull(message = "assignToUserId is required" , groups = {CreateValidationGroup.class})
    private UUID assignToUserId;

    @NotBlank(message = "userName is required" , groups = {CreateValidationGroup.class })
    private String userName;
    
}
