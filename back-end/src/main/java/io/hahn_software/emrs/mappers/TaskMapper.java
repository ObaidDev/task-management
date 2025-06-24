package io.hahn_software.emrs.mappers;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.List;

import org.springframework.stereotype.Component;

import io.hahn_software.emrs.dtos.TaskRequestDto;
import io.hahn_software.emrs.dtos.TaskResponseDto;
import io.hahn_software.emrs.entities.Task;
import io.hahn_software.emrs.utils.DateUtils;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class TaskMapper {




    public List<Task> toTaskList(List<TaskRequestDto> requests){

        return requests.stream()
                .map(this::toTask)
                .toList();

    }



     public List<TaskResponseDto> toTaskResponseDtoList(List<Task> tasks){

        return tasks.stream()
                .map(this::fromTask)
                .toList();

    }



    public Task toTask(TaskRequestDto request) {

        return Task.builder()
                .name(request.getName())
                .status(request.getStatus())
                .priority(request.getPriority())
                .description(request.getDescription())
                .estimateDate(DateUtils.longToInstant(request.getEstimateDate()))
                .assignToUserId(request.getAssignToUserId())
                .userName(request.getUserName())
                .build();
    }



    public TaskResponseDto fromTask(Task task) {


        return TaskResponseDto.builder()
                .id(task.getId())
                .name(task.getName())
                .status(task.getStatus())
                .priority(task.getPriority())
                .description(task.getDescription())
                .estimateDate(DateUtils.instantToLong(task.getEstimateDate()))
                .assignToUserId(task.getAssignToUserId())
                .userName(task.getUserName())
                .createdAt(DateUtils.instantToLong(task.getCreatedAt()))
                .updatedAt(DateUtils.instantToLong(task.getUpdatedAt()))
                .build();
    }

    
}
