-- Delete the "New Team Member" entry that was accidentally created
DELETE FROM leadership_team 
WHERE name = 'New Team Member' 
AND designation = 'Position';

-- Also clean up any other test/placeholder entries
DELETE FROM leadership_team 
WHERE name LIKE '%New%Member%' 
OR designation = 'Position';