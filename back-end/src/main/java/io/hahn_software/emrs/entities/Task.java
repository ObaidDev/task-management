package io.hahn_software.emrs.entities;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import io.hahn_software.emrs.enums.TaskPriority;
import io.hahn_software.emrs.enums.TaskStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(
        name = "tasks" ,
        indexes = {
            @Index(columnList = "tenantId" , name = "tasks_tenantid_idx") ,
            @Index(columnList = "tenantId, id", name = "idx_tasks_tenant_id_with_id") 
        },
        uniqueConstraints = {
            @UniqueConstraint(columnNames = {"tenantId" , "name"})
        }
)

@Data  @EqualsAndHashCode(callSuper = false)
@NoArgsConstructor @AllArgsConstructor @Builder
public class Task extends AbstractBaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE , generator = "tasks_seq")
    @SequenceGenerator(name = "tasks_seq" , sequenceName = "tasks_id_seq"  , allocationSize = 50)
    private Long id ;


    @Column(name = "name", nullable = false)
    private String name;


    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private TaskStatus status;


    @Enumerated(EnumType.STRING)
    @Column(name = "priority", nullable = false)
    private TaskPriority priority;


    @Column(name = "description")
    private String description;


    @Column(name = "estimate_date")
    private Instant estimateDate;


    @Column(name = "assign_to_user_id", nullable = false)
    private UUID assignToUserId;


    @Column(name = "user_name", nullable = false)
    private String userName;


    @CreationTimestamp
    private Instant createdAt ;

    @UpdateTimestamp
    private Instant updatedAt ;

   
    
}
