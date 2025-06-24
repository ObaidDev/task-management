package io.hahn_software.emrs.web;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.trackswiftly.utils.dtos.OperationResult;
import com.trackswiftly.utils.dtos.PageDTO;

import io.hahn_software.emrs.dtos.TaskRequestDto;
import io.hahn_software.emrs.dtos.TaskResponseDto;
import io.hahn_software.emrs.dtos.interfaces.CreateValidationGroup;
import io.hahn_software.emrs.dtos.interfaces.UpdateValidationGroup;
import io.hahn_software.emrs.services.TaskService;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/tasks")
@Slf4j
@Validated
public class TaskController {


    private final TaskService taskService;



    @Autowired
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }



    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Validated(CreateValidationGroup.class)
    public List<TaskResponseDto> createTasks(
        @RequestBody @Valid List<TaskRequestDto> taskRequests
    ) {
        return taskService.createEntities(taskRequests) ;
    }



    @GetMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<PageDTO<TaskResponseDto>> getTasksWithPagination(
        @RequestParam int page,
        @RequestParam int pageSize
    ) {

        return ResponseEntity.ok(

            /**
             * Retrieves a paginated list of tasks.
             *
             * @param page     the page number to retrieve (0-based index)
             * @param pageSize the number of tasks per page
             * @return a PageDTO containing the paginated list of TaskResponseDto
             */
            taskService.pageEntities(page, pageSize)
        );
    }




    @DeleteMapping("/{ids}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")   
    public ResponseEntity<OperationResult> deleteTasks(
        @Parameter(
            description = "Comma-separated list of Tasks IDs to be deleted",
            required = true,
            example = "1,2,3",
            schema = @Schema(type = "string")
        )
        @PathVariable List<Long> ids
    ) {

        return ResponseEntity.ok(
            /**
             * Deletes the tasks with the specified IDs.
             */
            taskService.deleteEntities(ids)
        );
    }



    @GetMapping("/{ids}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<TaskResponseDto>> findTasks(
        @Parameter(
            description = "Comma-separated list of Tasks IDs to be fetched",
            required = true,
            example = "1,2,3",
            schema = @Schema(type = "string")
        )
        @PathVariable List<Long> ids
    ) {

        return ResponseEntity.ok(
            /**
             * Retrieves the tasks with the specified IDs.
             */
            taskService.findEntities(ids)
        );
    }
    



    @PutMapping("/{ids}")
    @Validated(UpdateValidationGroup.class)
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<OperationResult> updateTasksInBatch(
        @Parameter(
            description = "Comma-separated list of Tasks IDs to be updated",
            required = true,
            example = "1,2,3",
            schema = @Schema(type = "string")
        )
        @PathVariable List<Long> ids,
        @Parameter(
            description = "Tasks object containing the fields to update",
            required = true
        )
        @Valid @RequestBody TaskRequestDto request
    ) {

        return ResponseEntity.ok(   
            /**
             * Updates the tasks with the specified IDs using the provided request object.
             */
            taskService.updateEntities(ids, request)
        );
    }
}
