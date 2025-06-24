package io.hahn_software.emrs.services;

import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.trackswiftly.utils.base.services.TrackSwiftlyServiceAbstract;
import com.trackswiftly.utils.dtos.OperationResult;
import com.trackswiftly.utils.dtos.PageDTO;

import io.hahn_software.emrs.annotations.LogUserOperation;
import io.hahn_software.emrs.dao.repositories.TaskRepo;
import io.hahn_software.emrs.dtos.TaskRequestDto;
import io.hahn_software.emrs.dtos.TaskResponseDto;
import io.hahn_software.emrs.mappers.TaskMapper;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;




@Slf4j
@Service
@Transactional
public class TaskService extends TrackSwiftlyServiceAbstract<Long , TaskRequestDto , TaskResponseDto >{


    private final TaskRepo  taskRepo;

    private final TaskMapper taskMapper;


    @Autowired
    public TaskService(TaskRepo taskRepo, TaskMapper taskMapper) {
        this.taskRepo = taskRepo;
        this.taskMapper = taskMapper;
    }


    @LogUserOperation("Delete multiple tasks in batch.")
    @Override
    public OperationResult deleteEntities(List<Long> ids) {

        if (ids == null || ids.isEmpty()) {
            return OperationResult.of(0);
        }

        int count = taskRepo.deleteByIds(ids); 

        return OperationResult.of(count) ;
        
    }

    @Override
    public List<TaskResponseDto> findEntities(List<Long> ids) {
        
        if (ids == null || ids.isEmpty()) {
            return Collections.emptyList();
        }

        return taskMapper.toTaskResponseDtoList(
            taskRepo.findByIds(ids)
        );
    }



    @Override
    public PageDTO<TaskResponseDto> pageEntities(int page, int pageSize) {

        if (page < 0 || pageSize <= 0) {
            throw new IllegalArgumentException("Page and pageSize must be positive values");
        }


        List<TaskResponseDto> content = taskMapper.toTaskResponseDtoList(
            taskRepo.findWithPagination(
                page,
                pageSize
            )
        ) ;


        long totalElements = taskRepo.count();

        int totalPages = (int) Math.ceil((double) totalElements / pageSize);

        return new PageDTO<>(content, page, pageSize, totalElements, totalPages);
    }

    @Override
    public List<TaskResponseDto> search(String arg0) {
        throw new UnsupportedOperationException("Unimplemented method 'search'");
    }


    @LogUserOperation("Created multiple tasks in batch.")
    @Override
    protected List<TaskResponseDto> performCreateEntities(List<TaskRequestDto> requests) {

        return taskMapper.toTaskResponseDtoList(
                taskRepo.insertInBatch(taskMapper.toTaskList(requests))
            );
    }



    @LogUserOperation("Updated multiple tasks in batch.")
    @Override
    protected OperationResult performUpdateEntities(List<Long> ids, TaskRequestDto request) {
        
        if (ids == null || ids.isEmpty()) {
            throw new IllegalArgumentException("Task IDs list cannot be null or empty");
        }

        if (request == null) {
            throw new IllegalArgumentException("Task object cannot be null");
        }

        return OperationResult.of(
                taskRepo.updateInBatch(ids, taskMapper.toTask(request))

        );
        
    }

    @Override
    protected void validateCreate(List<TaskRequestDto> arg0) {

        /*
         * we don't need to validate the create request here
         */
    }

    @Override
    protected void validateUpdate(List<Long> arg0, TaskRequestDto arg1) {
        /*
         * we don't need to validate the update request here
         */
    }
    
}
