import { Repository, DataSource } from 'typeorm';
import { Alert } from '../entities/alert.entity';

export class AlertRepository extends Repository<Alert> {
  constructor(dataSource: DataSource) {
    super(Alert, dataSource.createEntityManager());
  }

  // Custom methods can be added here if needed
}
