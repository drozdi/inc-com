<?php
namespace IncCom\Entity;

enum CategoryType: string {
    case income = 'income';
    case expense = 'expense';
    case transfer = 'transfer';
}
