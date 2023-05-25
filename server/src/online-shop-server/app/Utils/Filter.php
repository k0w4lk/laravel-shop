<?php

namespace App\Utils;

class Filter
{
  public static function applyFilters(&$sqlQuery, $queryParams): void
  {
    $filters = self::selectFilters($queryParams);

    foreach ($filters as $key => $value) {
      if (is_array($value)) {
        $sqlQuery->where(function ($query) use ($key, $value) {
          foreach ($value as $v) {
            $query->orWhere($key, $v);
          }
        });
      } else {
        $sqlQuery->where($key, $value);
      }
    }
  }

  public static function applyRangeSearch(&$sqlQuery, $queryParams): void
  {
    $rangeKeyFrom = config('constants.RANGE_KEY_FROM');
    $rangeKeyTo = config('constants.RANGE_KEY_TO');
    $filters = self::selectRangeFilters($queryParams);

    foreach ($filters as $col => $range) {
      foreach ($range as $key => $value) {
        if ($key === $rangeKeyFrom) {
          $sqlQuery->where($col, '>=', $value);
        } else if ($key === $rangeKeyTo) {
          $sqlQuery->where($col, '<=', $value);
        }
      }
    }
  }

  public static function applySorting(&$sqlQuery, $queryParams): void
  {
    if (isset($queryParams['sortOrder']) && isset($queryParams['sortBy'])) {
      $sortOrder = $queryParams['sortOrder'];
      $sortBy = $queryParams['sortBy'];

      $sqlQuery->orderBy($sortBy, $sortOrder);
    }
  }

  public static function applySearch(&$sqlQuery, $queryParams): void
  {
    if (isset($queryParams['searchField']) && isset($queryParams['searchValue'])) {
      $searchField = $queryParams['searchField'];
      $searchValue = $queryParams['searchValue'];

      $sqlQuery->where($searchField, 'LIKE', "%$searchValue%");
    }
  }

  private static function selectFilters(array $queryParams): array
  {
    $notFilterValues = config('constants.NOT_FILTER_VALUES');

    $filters = [];

    foreach ($queryParams as $key => $value) {
      if (!in_array($key, $notFilterValues) && !self::isArrayWithStringKeys($value)) {
        $filters[$key] = $value;
      }
    }

    return $filters;
  }

  private static function selectRangeFilters(array $queryParams): array
  {
    $rangeFilters = [];

    foreach ($queryParams as $key => $value) {
      if (self::isArrayWithStringKeys($value)) {
        $rangeFilters[$key] = $value;
      }
    }

    return $rangeFilters;
  }

  private static function isArrayWithStringKeys(mixed $array)
  {
    if (!is_array($array)) return false;
    return count(array_filter(array_keys($array), 'is_string')) > 0;
  }
}
